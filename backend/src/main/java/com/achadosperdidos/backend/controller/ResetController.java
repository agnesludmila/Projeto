package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.achadosperdidos.backend.service.ResetEmailService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class ResetController {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ResetEmailService resetEmailService;

    @PostMapping("/reset-email")
    public ResponseEntity<Map<String, Object>> solicitarRedefinicaoSenha(@RequestBody Map<String, String> request) {
        Map<String, Object> resposta = new HashMap<>();
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            resposta.put("codigo", 1);
            resposta.put("mensagem", "E-mail não fornecido.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isEmpty()) {
            resposta.put("codigo", 1);
            resposta.put("mensagem", "E-mail não encontrado.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resposta);
        }

        Usuario usuario = usuarioOpt.get();
        String token = UUID.randomUUID().toString();
        usuario.setToken(token);
        usuarioRepository.save(usuario);

        resetEmailService.enviarEmailRedefinicao(email, token);

        resposta.put("codigo", 0);
        resposta.put("mensagem", "Um link de redefinição de senha foi enviado para seu e-mail.");
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> redefinirSenha(@RequestBody Map<String, String> request) {
        Map<String, Object> resposta = new HashMap<>();


        String token = request.get("token");
        String novaSenha = request.get("novaSenha");

        if (token == null || token.isEmpty() || novaSenha == null || novaSenha.isEmpty()) {
            resposta.put("codigo", 1); //
            resposta.put("mensagem", "Token ou nova senha não fornecidos.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByToken(token);

        if (usuarioOpt.isEmpty()) {
            resposta.put("codigo", 1);
            resposta.put("mensagem", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }

        Usuario usuario = usuarioOpt.get();


        usuario.setSenha(novaSenha);
        usuario.setToken(null);
        usuarioRepository.save(usuario);

        resposta.put("codigo", 0);
        resposta.put("mensagem", "Senha atualizada com sucesso.");
        return ResponseEntity.ok(resposta);
    }

}
