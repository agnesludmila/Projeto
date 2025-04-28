package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*") // Permite chamadas do front
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/usuarios")
    public ResponseEntity<Map<String, Object>> cadastrarUsuario(@RequestBody Usuario usuario) {
        Map<String, Object> resposta = new HashMap<>();

        // Verifica se o email já está cadastrado
        Optional<Usuario> usuarioPorEmail = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioPorEmail.isPresent()) {
            resposta.put("codigo", 1);  // Usando Integer para o código
            resposta.put("mensagem", "Email já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }


        // Verifica se a matrícula já está cadastrada
        Optional<Usuario> usuarioPorMatricula = usuarioRepository.findByMatricula(usuario.getMatricula());
        if (usuarioPorMatricula.isPresent()) {
            resposta.put("codigo", 2);  // Usando Integer para o código
            resposta.put("mensagem", "Matrícula já cadastrada!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        // Salva o novo usuário
        usuario.setTokenAtivacao(UUID.randomUUID().toString());
        usuarioRepository.save(usuario);
        resposta.put("codigo", 0);  // Código 0 para sucesso
        resposta.put("mensagem", "Usuário cadastrado com sucesso. Verifique o email para ativar sua conta!");
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
