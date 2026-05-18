package com.projectcart.kafka;

import com.projectcart.service.FeedService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeedEventConsumer {
    private final FeedService feedService;

    @KafkaListener(topics = PostEventPublisher.TOPIC, groupId = "project-cart-feed")
    public void onPostCreated(PostCreatedEvent event) {
        try {
            feedService.fanOut(event.postId(), event.userId(), event.timestamp());
        } catch (Exception e) {
            log.error("Error in feed fan-out consumer: {}", e.getMessage(), e);
        }
    }
}
