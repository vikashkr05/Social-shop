package com.projectcart.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.*;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    @Bean
    public NewTopic postCreatedTopic() {
        return TopicBuilder.name("post.created").partitions(3).replicas(1).build();
    }
}
