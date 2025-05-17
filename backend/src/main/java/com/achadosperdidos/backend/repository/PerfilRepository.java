package com.achadosperdidos.backend.repository;

import com.achadosperdidos.backend.model.Perfil;
import com.achadosperdidos.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    Optional<Perfil> findByUsuarioId(Long usuarioId);
    Optional<Perfil> findByUsuario(Usuario usuario);
}
