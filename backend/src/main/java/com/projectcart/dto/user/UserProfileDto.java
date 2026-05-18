package com.projectcart.dto.user;

import java.util.UUID;

public record UserProfileDto(
    UUID id,
    String username,
    String bio,
    String avatarUrl,
    long postCount,
    long followerCount,
    long followingCount,
    boolean isFollowing
) {}
