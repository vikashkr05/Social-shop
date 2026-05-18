package com.projectcart.controller;

import com.projectcart.dto.post.*;
import com.projectcart.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(
        @Valid @RequestBody CreatePostRequest req,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(
            postService.createPost(UUID.fromString(userDetails.getUsername()), req)
        );
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
        @PathVariable UUID postId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        postService.deletePost(postId, UUID.fromString(userDetails.getUsername()));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Void> like(@PathVariable UUID postId, @AuthenticationPrincipal UserDetails u) {
        postService.likePost(postId, UUID.fromString(u.getUsername()));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Void> unlike(@PathVariable UUID postId, @AuthenticationPrincipal UserDetails u) {
        postService.unlikePost(postId, UUID.fromString(u.getUsername()));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<Void> save(@PathVariable UUID postId, @AuthenticationPrincipal UserDetails u) {
        postService.savePost(postId, UUID.fromString(u.getUsername()));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{postId}/save")
    public ResponseEntity<Void> unsave(@PathVariable UUID postId, @AuthenticationPrincipal UserDetails u) {
        postService.unsavePost(postId, UUID.fromString(u.getUsername()));
        return ResponseEntity.ok().build();
    }
}
