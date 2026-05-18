package com.projectcart.repository;

import com.projectcart.domain.Post;
import com.projectcart.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {
    Page<Post> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    long countByUser_Id(UUID userId);

    @Query("SELECT p FROM Post p JOIN FETCH p.user JOIN FETCH p.product WHERE p.id IN :ids")
    List<Post> findByIdInWithDetails(@Param("ids") List<UUID> ids);

    @Modifying
    @Query("UPDATE Post p SET p.likeCount = p.likeCount + :delta WHERE p.id = :id")
    void adjustLikeCount(@Param("id") UUID id, @Param("delta") int delta);

    @Modifying
    @Query("UPDATE Post p SET p.saveCount = p.saveCount + :delta WHERE p.id = :id")
    void adjustSaveCount(@Param("id") UUID id, @Param("delta") int delta);
}
