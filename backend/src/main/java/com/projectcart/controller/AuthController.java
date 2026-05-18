package com.projectcart.controller;

import com.projectcart.dto.auth.*;
import com.projectcart.dto.user.UserSummaryDto;
import com.projectcart.repository.UserRepository;
import com.projectcart.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserSummaryDto> me(@AuthenticationPrincipal UserDetails userDetails) {
        var user = userRepository.findById(UUID.fromString(userDetails.getUsername())).orElseThrow();
        return ResponseEntity.ok(AuthService.toSummary(user));
    }
}
