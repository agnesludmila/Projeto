package com.achadosperdidos.backend.repository;

import com.achadosperdidos.backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByNomeIgnoreCase(String nome);
    List<Tag> findAllByOrderByNomeAsc();
}