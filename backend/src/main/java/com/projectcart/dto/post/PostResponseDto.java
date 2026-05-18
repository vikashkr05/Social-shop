package com.projectcart.dto.post;

import com.projectcart.dto.user.UserSummaryDto;
import java.time.Instant;
import java.util.UUID;

public record PostResponseDto(
    UUID id,
    String caption,
    Instant createdAt,
    UserSummaryDto user,
    ProductDto product,
    int likeCount,
    int saveCount,
    boolean liked,
    boolean saved
) {}
