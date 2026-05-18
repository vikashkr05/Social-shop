package com.projectcart.dto.auth;

import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank @Size(min = 3, max = 50) String username,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password
) {}
