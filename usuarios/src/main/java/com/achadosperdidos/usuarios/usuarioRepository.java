package com.achadosperdidos.usuarios;

import org.springframework.data.jpa.repository.JpaRepository;

public interface usuarioRepository extends JpaRepository<usuario, Long> {
    // Você pode adicionar consultas personalizadas aqui depois, tipo:
    // Optional<Usuario> findByEmail(String email);
}
