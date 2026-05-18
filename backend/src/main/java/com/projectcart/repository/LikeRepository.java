package com.projectcart.repository;

import com.projectcart.domain.Like;
import com.projectcart.domain.LikeId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, LikeId> {
}
