package com.projectcart.dto.feed;

import com.projectcart.dto.post.PostResponseDto;
import java.util.List;

public record FeedResponseDto(List<PostResponseDto> posts, long nextCursor, boolean hasMore) {}
