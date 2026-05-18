package com.projectcart.service;

import com.projectcart.domain.User;
import com.projectcart.dto.auth.*;
import com.projectcart.dto.user.UserSummaryDto;
import com.projectcart.repository.UserRepository;
import com.projectcart.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email()))
            throw new IllegalArgumentException("Email already in use");
        if (userRepository.existsByUsername(req.username()))
            throw new IllegalArgumentException("Username already taken");

        User user = userRepository.save(User.builder()
            .username(req.username())
            .email(req.email())
            .passwordHash(passwordEncoder.encode(req.password()))
            .build());
        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
            .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash()))
            throw new BadCredentialsException("Invalid credentials");
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());
        return new AuthResponse(token, toSummary(user));
    }

    public static UserSummaryDto toSummary(User user) {
        return new UserSummaryDto(user.getId(), user.getUsername(), user.getAvatarUrl(), user.getBio());
    }
}
