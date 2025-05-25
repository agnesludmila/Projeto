package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.model.Perfil;
import com.achadosperdidos.backend.dto.PostagemDTO;
import com.achadosperdidos.backend.repository.PostagemRepository;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/postagem")
public class PostagemController {

    private final PostagemRepository postagemRepository;
    private final UsuarioRepository usuarioRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public PostagemController(PostagemRepository postagemRepository, UsuarioRepository usuarioRepository) {
        this.postagemRepository = postagemRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping(path = "/criar", consumes = "multipart/form-data")
    public ResponseEntity<?> criarPostagem(@RequestParam("titulo") String titulo,
                                           @RequestParam("descricao") String descricao,
                                           @RequestParam("usuarioId") Long usuarioId,
                                           @RequestParam(value = "imagem", required = false) MultipartFile imagem) {
        System.out.println("Recebido usuarioId: " + usuarioId);
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(usuarioId);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuário não encontrado");
        }

        Usuario usuario = usuarioOpt.get();
        Postagem postagem = new Postagem();
        postagem.setTitulo(titulo);
        postagem.setDescricao(descricao);
        postagem.setUsuario(usuario);
        postagem.setDataCriacao(LocalDateTime.now());

        if (imagem != null && !imagem.isEmpty()) {
            try {
                String basePath = System.getProperty("user.dir");
                Path uploadPath = Paths.get(basePath, uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String original = StringUtils.cleanPath(imagem.getOriginalFilename());
                String ext = original.contains(".") ? original.substring(original.lastIndexOf(".")) : ".jpg";

                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
                String filename = "post" + usuarioId + "_" + timestamp + ext;
                Path filePath = uploadPath.resolve(filename);

                imagem.transferTo(filePath.toFile());

                postagem.setCaminhoImagem("/uploads/" + filename);
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Erro ao salvar imagem: " + e.getMessage());
            }
        }

        Postagem novaPostagem = postagemRepository.save(postagem);

        // Incrementa o número de posts no perfil do usuário
        Perfil perfil = usuario.getPerfil();
        if (perfil != null) {
            perfil.setQntPosts(perfil.getQntPosts() + 1);
            usuarioRepository.save(usuario); // salva perfil pelo usuário (cascade deve estar configurado)
        }

        return ResponseEntity.ok(novaPostagem);
    }

    @GetMapping("/todas")
    public ResponseEntity<List<PostagemDTO>> listarPostagens() {
        List<Postagem> postagens = postagemRepository.findAll();

        List<PostagemDTO> dtos = postagens.stream()
                .map(PostagemDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/deletar/{id}")
    public ResponseEntity<?> deletarPostagem(@PathVariable Long id, @RequestHeader("userId") Long userId) {
        Optional<Postagem> postagemOpt = postagemRepository.findById(id);
        if (postagemOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Postagem não encontrada");
        }

        Postagem postagem = postagemOpt.get();

        if (!postagem.getUsuario().getId().equals(userId)) {
            return ResponseEntity.status(403).body("Você não tem permissão para apagar esta postagem");
        }

        postagemRepository.deleteById(id);
        return ResponseEntity.ok("Postagem deletada com sucesso");
    }
}
