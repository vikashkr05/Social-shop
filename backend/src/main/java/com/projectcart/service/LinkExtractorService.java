package com.projectcart.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectcart.dto.link.LinkMetaDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class LinkExtractorService {
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;

    public LinkMetaDto extract(String url) {
        String cacheKey = "link_meta:" + sha256(url);
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, LinkMetaDto.class);
            }
        } catch (Exception e) {
            log.warn("Redis cache read failed: {}", e.getMessage());
        }

        LinkMetaDto meta = fetchMeta(url);

        try {
            redisTemplate.opsForValue().set(
                cacheKey,
                objectMapper.writeValueAsString(meta),
                Duration.ofHours(24)
            );
        } catch (Exception e) {
            log.warn("Redis cache write failed: {}", e.getMessage());
        }
        return meta;
    }

    private LinkMetaDto fetchMeta(String url) {
        try {
            Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (compatible; ProjectCart/1.0)")
                .timeout(10_000)
                .get();

            String title = og(doc, "title");
            if (title == null || title.isBlank()) title = doc.title();

            String imageUrl = og(doc, "image");
            String siteName = og(doc, "site_name");
            BigDecimal price = extractPrice(doc);

            return new LinkMetaDto(title, imageUrl, price, siteName, url);
        } catch (Exception e) {
            log.warn("Failed to extract metadata from {}: {}", url, e.getMessage());
            return new LinkMetaDto(null, null, null, null, url);
        }
    }

    private BigDecimal extractPrice(Document doc) {
        for (String prop : new String[]{"price:amount", "product:price:amount", "price"}) {
            String val = og(doc, prop);
            if (val != null) {
                try {
                    return new BigDecimal(val.replaceAll("[^0-9.]", ""));
                } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private String og(Document doc, String property) {
        var el = doc.selectFirst("meta[property=og:" + property + "]");
        return el != null ? el.attr("content") : null;
    }

    private String sha256(String input) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                .digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            return String.valueOf(input.hashCode());
        }
    }
}
