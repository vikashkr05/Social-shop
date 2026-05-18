package com.projectcart.kafka;

import java.util.UUID;

public record PostCreatedEvent(UUID postId, UUID userId, long timestamp) {}
