package com.achadosperdidos.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;

public interface usuarioRepository extends JpaRepository<usuarioCadastro, Long> {
    usuarioCadastro findByEmail(String email);
}
