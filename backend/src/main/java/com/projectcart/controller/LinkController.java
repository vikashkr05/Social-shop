package com.projectcart.controller;

import com.projectcart.dto.link.LinkMetaDto;
import com.projectcart.service.LinkExtractorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class LinkController {
    private final LinkExtractorService linkExtractorService;

    @PostMapping("/extract")
    public ResponseEntity<LinkMetaDto> extract(@Valid @RequestBody LinkMetaDto.ExtractRequest req) {
        return ResponseEntity.ok(linkExtractorService.extract(req.url()));
    }
}
