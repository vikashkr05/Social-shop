package com.projectcart.dto.post;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductDto(
    UUID id,
    String title,
    String imageUrl,
    BigDecimal priceSnapshot,
    String originalUrl,
    String siteName,
    String affiliateUrl
) {}
