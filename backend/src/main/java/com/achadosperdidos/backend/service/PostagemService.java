package com.achadosperdidos.backend.service;

import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.model.Usuario;
import com.achadosperdidos.backend.repository.PostagemRepository;
import com.achadosperdidos.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PostagemService {

    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void criarPostagem(String titulo, String descricao, List<MultipartFile> imagens, Long usuarioId) throws IOException {
        Usuario autor = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        for (MultipartFile imagem : imagens) {
            String nomeArquivo = UUID.randomUUID() + "_" + imagem.getOriginalFilename();
            Path caminho = Paths.get("uploads/" + nomeArquivo);

            Files.createDirectories(caminho.getParent());

            Files.write(caminho, imagem.getBytes());

            Postagem postagem = new Postagem();
            postagem.setTitulo(titulo);
            postagem.setDescricao(descricao);
            postagem.setCaminhoImagem(caminho.toString());
            postagem.setDataCriacao(LocalDateTime.now());
            postagem.setAutor(autor);

            postagemRepository.save(postagem);
        }
    }
}
