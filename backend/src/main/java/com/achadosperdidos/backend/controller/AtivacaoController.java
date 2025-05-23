package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/ativacao")

public class AtivacaoController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> ativarConta(@RequestBody Map<String, String> request) {
        Map<String, Object> resposta = new HashMap<>();

        String token = request.get("token");

        Optional<Usuario> usuarioOpt = usuarioRepository.findByToken(token);

        if (usuarioOpt.isEmpty()) {
            resposta.put("codigo", 1);
            resposta.put("mensagem", "Token inválido ou expirado.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resposta);
        }

        Usuario usuario = usuarioOpt.get();

        usuario.setAtivo(true);
        usuario.setToken(null);
        usuarioRepository.save(usuario);

        resposta.put("codigo", 0);
        resposta.put("mensagem", "Conta ativada com sucesso!");
        return ResponseEntity.ok(resposta);
    }

}
