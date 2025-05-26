package com.achadosperdidos.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import com.achadosperdidos.backend.model.Postagem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PostagemRepository extends JpaRepository<Postagem, Long> {
    List<Postagem> findByDataCriacaoBefore(LocalDateTime limite);
    List<Postagem> findByUsuarioIdOrderByDataCriacaoDesc(Long usuarioId);
    List<Postagem> findAllByOrderByDataCriacaoDesc();
    List<Postagem> findByUsuarioId(Long usuarioId);
    List<Postagem> findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCase(String tituloTermo, String descricaoTermo);
    @Query("SELECT p FROM Postagem p LEFT JOIN FETCH p.usuario u LEFT JOIN FETCH u.perfil WHERE EXISTS (SELECT t FROM p.tags t WHERE LOWER(t.nome) = LOWER(:nomeTag))")
    List<Postagem> findByTagNameWithUserDetails(@Param("nomeTag") String nomeTag);
    boolean existsByTags_Id(Long tagId);


}

