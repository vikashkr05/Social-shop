package com.projectcart.repository;

import com.projectcart.domain.Follow;
import com.projectcart.domain.FollowId;
import com.projectcart.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface FollowRepository extends JpaRepository<Follow, FollowId> {
    @Query("SELECT f.following FROM Follow f WHERE f.follower.id = :userId")
    List<User> findFollowingByUserId(@Param("userId") UUID userId);

    @Query("SELECT f.follower FROM Follow f WHERE f.following.id = :userId")
    List<User> findFollowersByUserId(@Param("userId") UUID userId);

    @Query("SELECT f.follower.id FROM Follow f WHERE f.following.id = :userId")
    List<UUID> findFollowerIdsByUserId(@Param("userId") UUID userId);

    long countByFollowerId(UUID followerId);
    long countByFollowingId(UUID followingId);
}
