package com.projectcart.dto.link;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record LinkMetaDto(
    String title,
    String imageUrl,
    BigDecimal priceSnapshot,
    String siteName,
    String originalUrl
) {
    public record ExtractRequest(@NotBlank String url) {}
}
