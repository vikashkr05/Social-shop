package com.projectcart.domain;

import jakarta.persistence.Embeddable;
import lombok.*;
import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode
public class SaveId implements Serializable {
    private UUID userId;
    private UUID postId;
}
