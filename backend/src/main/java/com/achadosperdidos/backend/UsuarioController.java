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
        Map<String, String> resposta = new HashMap<>();

        // Verifica se o email já está cadastrado
        Optional<Usuario> usuarioPorEmail = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioPorEmail.isPresent()) {
            resposta.put("mensagem", "Email já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        // Verifica se a matrícula já está cadastrada
        Optional<Usuario> usuarioPorMatricula = usuarioRepository.findByMatricula(usuario.getMatricula());
        if (usuarioPorMatricula.isPresent()) {
            resposta.put("mensagem", "Matrícula já cadastrada!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        // Salva o novo usuário
        usuarioRepository.save(usuario);
        resposta.put("mensagem", "Usuário cadastrado com sucesso!");
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Usuario usuario) {
        boolean autenticado = usuarioRepository
                .findByEmailAndSenha(usuario.getEmail(), usuario.getSenha())
                .isPresent();

        if (autenticado) {
            return ResponseEntity.ok("Login bem-sucedido!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos!");
        }
    }
}
