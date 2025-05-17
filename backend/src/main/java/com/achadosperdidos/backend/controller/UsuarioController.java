package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Perfil;
import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.PerfilRepository;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import com.achadosperdidos.backend.service.AtivacaoEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;
    private final AtivacaoEmailService ativacaoEmailService;

    @Autowired
    public UsuarioController(UsuarioRepository usuarioRepository,
                             PerfilRepository perfilRepository,
                             AtivacaoEmailService ativacaoEmailService) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
        this.ativacaoEmailService = ativacaoEmailService;
    }

    @Transactional
    @PostMapping("/cadastro")
    public ResponseEntity<Map<String, Object>> cadastrarUsuario(@RequestBody Usuario usuario) {
        Map<String, Object> resposta = new HashMap<>();

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            resposta.put("codigo", 1);
            resposta.put("mensagem", "Email já cadastrado!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }
        if (usuarioRepository.findByMatricula(usuario.getMatricula()).isPresent()) {
            resposta.put("codigo", 2);
            resposta.put("mensagem", "Matrícula já cadastrada!");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resposta);
        }

        usuario.setToken(UUID.randomUUID().toString());
        Usuario savedUser = usuarioRepository.save(usuario);

        // Cria e salva o perfil vazio imediatamente
        Perfil perfil = new Perfil();
        perfil.setUsuario(savedUser);
        perfilRepository.save(perfil);

        ativacaoEmailService.enviarEmailAtivacao(savedUser.getEmail(), savedUser.getToken());

        resposta.put("codigo", 0);
        resposta.put("mensagem", "Usuário cadastrado com sucesso. Verifique o email para ativar sua conta!");
        return ResponseEntity.ok(resposta);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Usuario usuario) {
        Map<String, Object> resposta = new HashMap<>();

        Optional<Usuario> usuarioOptional =
                usuarioRepository.findByEmailAndSenha(usuario.getEmail(), usuario.getSenha());

        if (usuarioOptional.isPresent()) {
            Usuario usuarioEncontrado = usuarioOptional.get();

            if (!usuarioEncontrado.getAtivo()) {
                resposta.put("codigo", 1);
                resposta.put("mensagem", "Conta ainda não ativada.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(resposta);
            }

            // Checa se já existe perfil *com* foto
            Perfil perfil = usuarioEncontrado.getPerfil();
            boolean fotoVazia = (perfil == null)
                    || (perfil.getFotoPerfil() == null)
                    || perfil.getFotoPerfil().trim().isEmpty();

            if (fotoVazia) {
                resposta.put("codigo", 2);
                resposta.put("mensagem", "Criação de perfil necessária.");
                resposta.put("id", usuarioEncontrado.getId());
                return ResponseEntity.ok(resposta);
            }

            resposta.put("codigo", 0);
            resposta.put("mensagem", "Login bem‑sucedido!");
            resposta.put("id", usuarioEncontrado.getId());
            return ResponseEntity.ok(resposta);
        }

        resposta.put("codigo", 3);
        resposta.put("mensagem", "Email ou senha inválidos!");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resposta);
    }


}
