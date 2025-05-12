package com.achadosperdidos.backend.repository;

import com.achadosperdidos.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndSenha(String email, String senha);
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByMatricula(String matricula);
    Optional<Usuario> findByTokenAtivacao(String tokenAtivacao);
}
