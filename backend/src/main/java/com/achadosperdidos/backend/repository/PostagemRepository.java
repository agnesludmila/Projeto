package com.achadosperdidos.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import com.achadosperdidos.backend.model.Postagem;

public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findByDataCriacaoBefore(LocalDateTime limite);
}
