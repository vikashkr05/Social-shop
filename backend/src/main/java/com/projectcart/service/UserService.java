package com.projectcart.service;

import com.projectcart.domain.User;
import com.projectcart.domain.FollowId;
import com.projectcart.dto.user.UserProfileDto;
import com.projectcart.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String username, UUID currentUserId) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
        long followers = followRepository.countByFollowingId(user.getId());
        long following = followRepository.countByFollowerId(user.getId());
        long posts = postRepository.countByUser_Id(user.getId());
        boolean isFollowing = currentUserId != null &&
            followRepository.existsById(new FollowId(currentUserId, user.getId()));
        return new UserProfileDto(
            user.getId(), user.getUsername(), user.getBio(), user.getAvatarUrl(),
            posts, followers, following, isFollowing
        );
    }

    public User getById(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }
}
