package com.projectcart.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PostEventPublisher {
    public static final String TOPIC = "post.created";
    private final KafkaTemplate<String, PostCreatedEvent> kafkaTemplate;

    public void publishPostCreated(PostCreatedEvent event) {
        try {
            kafkaTemplate.send(TOPIC, event.postId().toString(), event);
            log.debug("Published post.created for postId={}", event.postId());
        } catch (Exception e) {
            log.warn("Kafka unavailable, skipping publish: {}", e.getMessage());
        }
    }
}
