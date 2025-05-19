package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Perfil;
import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.PerfilRepository;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/perfil")
public class PerfilController {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public PerfilController(UsuarioRepository usuarioRepository,
                            PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPerfil(@PathVariable Long id) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        Perfil perfil = usuario.getPerfil();
        if (perfil == null) {
            perfil = new Perfil();
            perfil.setUsuario(usuario);
            perfilRepository.save(perfil);
            usuario.setPerfil(perfil);
        }

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("nome", usuario.getNome());
        resposta.put("email", usuario.getEmail());
        resposta.put("telefone", usuario.getTelefone());
        resposta.put("biografia", perfil.getBiografia());
        resposta.put("fotoPerfil", perfil.getFotoPerfil());
        resposta.put("qntPosts", perfil.getQntPosts());
        resposta.put("qntComentario", perfil.getQntComentario());

        return ResponseEntity.ok(resposta);
    }

    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarPerfil(@PathVariable Long id,
                                             @RequestBody Map<String, Object> dados) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        if (dados.containsKey("nome")) {
            usuario.setNome((String) dados.get("nome"));
        }
        if (dados.containsKey("telefone")) {
            usuario.setTelefone((String) dados.get("telefone"));
        }

        Perfil perfil = usuario.getPerfil();
        if (perfil == null) {
            perfil = new Perfil();
            perfil.setUsuario(usuario);
            usuario.setPerfil(perfil);
        }

        if (dados.containsKey("biografia")) {
            perfil.setBiografia((String) dados.get("biografia"));
        }
        if (dados.containsKey("fotoPerfil")) {
            perfil.setFotoPerfil((String) dados.get("fotoPerfil"));
        }

        usuarioRepository.save(usuario);

        return ResponseEntity.ok(Map.of("mensagem", "Perfil atualizado com sucesso"));
    }

    @PostMapping(path = "/{id}/foto", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadFoto(@PathVariable Long id,
                                        @RequestParam("file") MultipartFile file) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        Perfil perfil = usuario.getPerfil();
        if (perfil == null) {
            perfil = new Perfil();
            perfil.setUsuario(usuario);
            usuario.setPerfil(perfil);
        }

        try {
            String basePath = System.getProperty("user.dir");
            Path uploadPath = Paths.get(basePath, uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String original = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int dotIndex = original.lastIndexOf('.');
            if (dotIndex >= 0) {
                ext = original.substring(dotIndex);
            } else {
                ext = ".jpg";
            }

            String filename = "foto_id" + id + ext;
            Path filePath = uploadPath.resolve(filename);

            Files.deleteIfExists(filePath);

            file.transferTo(filePath.toFile());

            String url = "/uploads/" + filename;
            perfil.setFotoPerfil(url);

            usuarioRepository.save(usuario);

            return ResponseEntity.ok(Map.of("url", url));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Falha ao salvar arquivo: " + e.getMessage());
        }
    }

}
