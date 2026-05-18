package com.projectcart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "follows")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Follow {
    @EmbeddedId
    private FollowId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followerId")
    @JoinColumn(name = "follower_id")
    private User follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("followingId")
    @JoinColumn(name = "following_id")
    private User following;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
