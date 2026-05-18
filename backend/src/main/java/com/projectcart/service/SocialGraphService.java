package com.projectcart.service;

import com.projectcart.domain.*;
import com.projectcart.dto.user.UserSummaryDto;
import com.projectcart.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SocialGraphService {
    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public void follow(UUID followerId, UUID followingId) {
        if (followerId.equals(followingId))
            throw new IllegalArgumentException("Cannot follow yourself");
        FollowId id = new FollowId(followerId, followingId);
        if (!followRepository.existsById(id)) {
            User follower = userService.getById(followerId);
            User following = userService.getById(followingId);
            followRepository.save(Follow.builder().id(id).follower(follower).following(following).build());
        }
    }

    @Transactional
    public void unfollow(UUID followerId, UUID followingId) {
        followRepository.deleteById(new FollowId(followerId, followingId));
    }

    public boolean isFollowing(UUID followerId, UUID followingId) {
        return followRepository.existsById(new FollowId(followerId, followingId));
    }

    public List<UserSummaryDto> getFollowers(String username) {
        User user = userService.getByUsername(username);
        return followRepository.findFollowersByUserId(user.getId())
            .stream().map(AuthService::toSummary).collect(Collectors.toList());
    }

    public List<UserSummaryDto> getFollowing(String username) {
        User user = userService.getByUsername(username);
        return followRepository.findFollowingByUserId(user.getId())
            .stream().map(AuthService::toSummary).collect(Collectors.toList());
    }
}
