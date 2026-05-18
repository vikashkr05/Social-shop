package com.projectcart.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.kafka.config.KafkaListenerEndpointRegistry;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaStartupRunner implements ApplicationRunner {
    private final KafkaListenerEndpointRegistry registry;

    @Override
    public void run(ApplicationArguments args) {
        Thread.ofVirtual().start(() -> {
            while (!registry.isRunning()) {
                try {
                    Thread.sleep(5_000);
                    registry.start();
                    log.info("Kafka listeners started");
                } catch (Exception e) {
                    log.warn("Kafka not available, retrying in 5s: {}", e.getMessage());
                }
            }
        });
    }
}
