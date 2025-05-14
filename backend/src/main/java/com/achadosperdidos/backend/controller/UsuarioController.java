package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.achadosperdidos.backend.service.AtivacaoEmailService;



import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class UsuarioController {

    @Autowired
    private AtivacaoEmailService ativacaoEmailService;

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/cadastro")
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
        usuario.setToken(UUID.randomUUID().toString());
        usuarioRepository.save(usuario);
        ativacaoEmailService.enviarEmailAtivacao(usuario.getEmail(), usuario.getToken());

        resposta.put("codigo", 0);  // Código 0 para sucesso
        resposta.put("mensagem", "Usuário cadastrado com sucesso. Verifique o email para ativar sua conta!");
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Usuario usuario) {
        Map<String, Object> resposta = new HashMap<>();

        Optional<Usuario> usuarioOptional = usuarioRepository
                .findByEmailAndSenha(usuario.getEmail(), usuario.getSenha());

        if (usuarioOptional.isPresent()) {
            Usuario usuarioEncontrado = usuarioOptional.get();

            if (!usuarioEncontrado.getAtivo()) {
                resposta.put("codigo", 1);  // Usuário não ativado
                resposta.put("mensagem", "Conta ainda não ativada.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resposta);
            }


            if (usuarioEncontrado.getPerfil() == null) {
                resposta.put("codigo", 2);  // Redireciona para criação de perfil
                resposta.put("mensagem", "Criação de perfil necessária.");
                return ResponseEntity.status(HttpStatus.OK).body(resposta);
            }

            resposta.put("codigo", 0);
            resposta.put("mensagem", "Login bem-sucedido!");
            return ResponseEntity.ok(resposta);
        }

        resposta.put("codigo", 3);
        resposta.put("mensagem", "Email ou senha inválidos!");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
    }

}
