package com.projectcart.service;

import com.projectcart.domain.*;
import com.projectcart.dto.post.*;
import com.projectcart.kafka.PostCreatedEvent;
import com.projectcart.kafka.PostEventPublisher;
import com.projectcart.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {
    private final PostRepository postRepository;
    private final ProductRepository productRepository;
    private final LikeRepository likeRepository;
    private final SaveRepository saveRepository;
    private final UserService userService;
    private final LinkExtractorService linkExtractorService;
    private final PostEventPublisher postEventPublisher;

    @Value("${app.affiliate.tag}")
    private String affiliateTag;

    @Transactional
    public PostResponseDto createPost(UUID userId, CreatePostRequest req) {
        User user = userService.getById(userId);
        var meta = linkExtractorService.extract(req.url());

        Product product = productRepository.findByOriginalUrl(req.url())
            .orElseGet(() -> productRepository.save(Product.builder()
                .originalUrl(req.url())
                .title(meta.title())
                .imageUrl(meta.imageUrl())
                .priceSnapshot(meta.priceSnapshot())
                .siteName(meta.siteName())
                .build()));

        Post post = postRepository.save(Post.builder()
            .user(user).product(product).caption(req.caption()).build());

        long ts = post.getCreatedAt().toEpochMilli();
        postEventPublisher.publishPostCreated(new PostCreatedEvent(post.getId(), userId, ts));

        return toDto(post, userId);
    }

    @Transactional
    public void deletePost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        if (!post.getUser().getId().equals(userId))
            throw new SecurityException("Not authorized to delete this post");
        postRepository.delete(post);
    }

    @Transactional
    public void likePost(UUID postId, UUID userId) {
        LikeId id = new LikeId(userId, postId);
        if (!likeRepository.existsById(id)) {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
            likeRepository.save(Like.builder().id(id).user(userService.getById(userId)).post(post).build());
            postRepository.adjustLikeCount(postId, 1);
        }
    }

    @Transactional
    public void unlikePost(UUID postId, UUID userId) {
        LikeId id = new LikeId(userId, postId);
        if (likeRepository.existsById(id)) {
            likeRepository.deleteById(id);
            postRepository.adjustLikeCount(postId, -1);
        }
    }

    @Transactional
    public void savePost(UUID postId, UUID userId) {
        SaveId id = new SaveId(userId, postId);
        if (!saveRepository.existsById(id)) {
            Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
            saveRepository.save(Save.builder().id(id).user(userService.getById(userId)).post(post).build());
            postRepository.adjustSaveCount(postId, 1);
        }
    }

    @Transactional
    public void unsavePost(UUID postId, UUID userId) {
        SaveId id = new SaveId(userId, postId);
        if (saveRepository.existsById(id)) {
            saveRepository.deleteById(id);
            postRepository.adjustSaveCount(postId, -1);
        }
    }

    @Transactional(readOnly = true)
    public Page<PostResponseDto> getUserPosts(String username, UUID currentUserId, Pageable pageable) {
        User user = userService.getByUsername(username);
        return postRepository.findByUserOrderByCreatedAtDesc(user, pageable)
            .map(p -> toDto(p, currentUserId));
    }

    public List<PostResponseDto> hydratePostIds(List<UUID> postIds, UUID userId) {
        if (postIds.isEmpty()) return Collections.emptyList();
        Map<UUID, Post> postMap = postRepository.findByIdInWithDetails(postIds)
            .stream().collect(Collectors.toMap(Post::getId, p -> p));
        return postIds.stream()
            .filter(postMap::containsKey)
            .map(id -> toDto(postMap.get(id), userId))
            .collect(Collectors.toList());
    }

    public PostResponseDto toDto(Post post, UUID currentUserId) {
        boolean liked = currentUserId != null && likeRepository.existsById(new LikeId(currentUserId, post.getId()));
        boolean saved = currentUserId != null && saveRepository.existsById(new SaveId(currentUserId, post.getId()));
        Product p = post.getProduct();
        String sep = p.getOriginalUrl().contains("?") ? "&" : "?";
        ProductDto productDto = new ProductDto(
            p.getId(), p.getTitle(), p.getImageUrl(), p.getPriceSnapshot(),
            p.getOriginalUrl(), p.getSiteName(), p.getOriginalUrl() + sep + "tag=" + affiliateTag
        );
        return new PostResponseDto(
            post.getId(), post.getCaption(), post.getCreatedAt(),
            AuthService.toSummary(post.getUser()), productDto,
            post.getLikeCount(), post.getSaveCount(), liked, saved
        );
    }
}
