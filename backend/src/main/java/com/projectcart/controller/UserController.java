package com.projectcart.controller;

import com.projectcart.dto.post.PostResponseDto;
import com.projectcart.dto.user.*;
import com.projectcart.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final PostService postService;
    private final SocialGraphService socialGraphService;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDto> getProfile(
        @PathVariable String username,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        UUID currentUserId = userDetails != null ? UUID.fromString(userDetails.getUsername()) : null;
        return ResponseEntity.ok(userService.getProfile(username, currentUserId));
    }

    @GetMapping("/{username}/posts")
    public ResponseEntity<Page<PostResponseDto>> getUserPosts(
        @PathVariable String username,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        UUID currentUserId = userDetails != null ? UUID.fromString(userDetails.getUsername()) : null;
        return ResponseEntity.ok(postService.getUserPosts(username, currentUserId, PageRequest.of(page, size)));
    }

    @GetMapping("/{username}/followers")
    public ResponseEntity<List<UserSummaryDto>> getFollowers(@PathVariable String username) {
        return ResponseEntity.ok(socialGraphService.getFollowers(username));
    }

    @GetMapping("/{username}/following")
    public ResponseEntity<List<UserSummaryDto>> getFollowing(@PathVariable String username) {
        return ResponseEntity.ok(socialGraphService.getFollowing(username));
    }
}
