package com.projectcart.repository;

import com.projectcart.domain.Save;
import com.projectcart.domain.SaveId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaveRepository extends JpaRepository<Save, SaveId> {
}
