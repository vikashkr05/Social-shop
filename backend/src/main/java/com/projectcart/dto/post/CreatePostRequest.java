package com.projectcart.dto.post;

import jakarta.validation.constraints.NotBlank;

public record CreatePostRequest(
    @NotBlank String url,
    String caption
) {}
