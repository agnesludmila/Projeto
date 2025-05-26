package com.achadosperdidos.backend.service;

import com.achadosperdidos.backend.model.Categoria;
import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.model.Tag; // Novo import
import com.achadosperdidos.backend.dto.PostagemDTO;
import com.achadosperdidos.backend.repository.CategoriaRepository;
import com.achadosperdidos.backend.repository.PostagemRepository;
import com.achadosperdidos.backend.repository.TagRepository; // Novo import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PostagemRepository postagemRepository;

    @Autowired
    private TagRepository tagRepository; // Nova injeção


    public List<PostagemDTO> buscarDTOPorCategoriaEUsuario(String nomeCategoria, Long usuarioId) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findByNome(nomeCategoria);
        if (categoriaOpt.isPresent() && categoriaOpt.get().buscarItens() != null) {
            List<Postagem> entidades = categoriaOpt.get().buscarItens()
                    .stream()
                    .filter(p -> p.getUsuario() != null && p.getUsuario().getId().equals(usuarioId))
                    .collect(Collectors.toList());
            return entidades.stream().map(PostagemDTO::new).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public List<PostagemDTO> buscarDTOPorNomeCategoria(String nomeCategoria) {
        Optional<Categoria> categoriaOpt = categoriaRepository.findByNome(nomeCategoria);
        List<Postagem> entidades = categoriaOpt.map(Categoria::buscarItens).orElse(Collections.emptyList());
        return entidades.stream().map(PostagemDTO::new).collect(Collectors.toList());
    }


    public Set<String> gerarTermosChaveDeTodasPostagens() {
        List<Tag> todasTags = tagRepository.findAllByOrderByNomeAsc();
        return todasTags.stream()
                .map(Tag::getNome)
                .collect(Collectors.toSet());
    }


    public List<PostagemDTO> buscarPostagensDTOPorTermoNoConteudo(String termo) {
        if (termo == null || termo.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<Postagem> postagensEntidades = postagemRepository.findByTagNameWithUserDetails(termo);
        return postagensEntidades.stream()
                .map(PostagemDTO::new)
                .collect(Collectors.toList());
    }
}