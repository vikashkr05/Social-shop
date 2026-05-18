package com.projectcart.controller;

import com.projectcart.service.SocialGraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/social")
@RequiredArgsConstructor
public class SocialGraphController {
    private final SocialGraphService socialGraphService;

    @PostMapping("/follow/{userId}")
    public ResponseEntity<Void> follow(
        @PathVariable UUID userId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        socialGraphService.follow(UUID.fromString(userDetails.getUsername()), userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/unfollow/{userId}")
    public ResponseEntity<Void> unfollow(
        @PathVariable UUID userId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        socialGraphService.unfollow(UUID.fromString(userDetails.getUsername()), userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/is-following/{userId}")
    public ResponseEntity<Map<String, Boolean>> isFollowing(
        @PathVariable UUID userId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean following = socialGraphService.isFollowing(
            UUID.fromString(userDetails.getUsername()), userId
        );
        return ResponseEntity.ok(Map.of("following", following));
    }
}
