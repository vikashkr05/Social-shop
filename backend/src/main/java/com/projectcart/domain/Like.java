package com.projectcart.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "likes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Like {
    @EmbeddedId
    private LikeId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("postId")
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();
}
