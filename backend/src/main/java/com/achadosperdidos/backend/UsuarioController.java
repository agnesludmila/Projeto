package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*") // Permite chamadas do front
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Map<String, String>> cadastrarUsuario(@RequestBody Usuario usuario) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByEmail(usuario.getEmail());

        Map<String, String> resposta = new HashMap<>();

        if (usuarioExistente.isPresent()) {
            resposta.put("mensagem", "Email já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        usuarioRepository.save(usuario);
        resposta.put("mensagem", "Usuário cadastrado com sucesso!");
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/login")
    public String login(@RequestBody Usuario usuario) {
        return usuarioRepository.findByEmailAndSenha(usuario.getEmail(), usuario.getSenha())
                .map(u -> "Login bem-sucedido!")
                .orElse("Email ou senha inválidos");
    }
}
