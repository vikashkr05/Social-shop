package com.projectcart.service;

import com.projectcart.dto.feed.FeedResponseDto;
import com.projectcart.dto.post.PostResponseDto;
import com.projectcart.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedService {
    private final RedisTemplate<String, String> redisTemplate;
    private final FollowRepository followRepository;
    private final PostService postService;

    @Value("${app.feed.max-size:800}")
    private long feedMaxSize;

    public void fanOut(UUID postId, UUID authorId, long timestamp) {
        List<UUID> recipients = new ArrayList<>(followRepository.findFollowerIdsByUserId(authorId));
        recipients.add(authorId);

        for (UUID recipientId : recipients) {
            String key = "feed:" + recipientId;
            try {
                redisTemplate.opsForZSet().add(key, postId.toString(), (double) timestamp);
                Long size = redisTemplate.opsForZSet().size(key);
                if (size != null && size > feedMaxSize) {
                    redisTemplate.opsForZSet().removeRange(key, 0, size - feedMaxSize - 1);
                }
            } catch (Exception e) {
                log.warn("Feed fan-out failed for recipientId={}: {}", recipientId, e.getMessage());
            }
        }
    }

    public FeedResponseDto getFeed(UUID userId, long cursor, int size) {
        String key = "feed:" + userId;
        Set<String> postIdStrings = redisTemplate.opsForZSet().reverseRange(key, cursor, cursor + size - 1);
        if (postIdStrings == null || postIdStrings.isEmpty()) {
            return new FeedResponseDto(Collections.emptyList(), cursor, false);
        }

        List<UUID> postIds = postIdStrings.stream().map(UUID::fromString).collect(Collectors.toList());
        List<PostResponseDto> posts = postService.hydratePostIds(postIds, userId);
        long nextCursor = cursor + posts.size();
        Long totalSize = redisTemplate.opsForZSet().size(key);
        boolean hasMore = totalSize != null && nextCursor < totalSize;

        return new FeedResponseDto(posts, nextCursor, hasMore);
    }
}
