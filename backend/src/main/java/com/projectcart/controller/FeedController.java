package com.projectcart.controller;

import com.projectcart.dto.feed.FeedResponseDto;
import com.projectcart.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/feed")
@RequiredArgsConstructor
public class FeedController {
    private final FeedService feedService;

    @GetMapping
    public ResponseEntity<FeedResponseDto> getFeed(
        @RequestParam(defaultValue = "0") long cursor,
        @RequestParam(defaultValue = "20") int size,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
            feedService.getFeed(UUID.fromString(userDetails.getUsername()), cursor, size)
        );
    }
}
