package com.achadosperdidos.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional; // Certifique-se que este import está correto
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.achadosperdidos.backend.dto.PostagemDTO;
import com.achadosperdidos.backend.model.Categoria;
import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.repository.CategoriaRepository;
import com.achadosperdidos.backend.repository.PostagemRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PostagemRepository postagemRepository;

    // Método original mantido se necessário internamente, ou pode ser adaptado/removido
    private List<Postagem> buscarEntidadesPorCategoriaEUsuario(String nomeCategoria, Long usuarioId) {
        Optional<Categoria> categoria = categoriaRepository.findByNome(nomeCategoria);
        if (categoria.isPresent() && categoria.get().buscarItens() != null) {
            return categoria.get().buscarItens()
                    .stream()
                    .filter(p -> p.getUsuario() != null && p.getUsuario().getId().equals(usuarioId))
                    .collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

    public List<PostagemDTO> buscarDTOPorCategoriaEUsuario(String nomeCategoria, Long usuarioId) {
        List<Postagem> postagensEntidades = buscarEntidadesPorCategoriaEUsuario(nomeCategoria, usuarioId);
        return postagensEntidades.stream()
                .map(PostagemDTO::new)
                .collect(Collectors.toList());
    }

    // Método original mantido se necessário internamente, ou pode ser adaptado/removido
    private List<Postagem> buscarEntidadesPorNomeCategoria(String nomeCategoria) {
        Optional<Categoria> categoria = categoriaRepository.findByNome(nomeCategoria);
        return categoria.map(Categoria::buscarItens).orElse(Collections.emptyList());
    }

    public List<PostagemDTO> buscarDTOPorNomeCategoria(String nomeCategoria) {
        List<Postagem> postagensEntidades = buscarEntidadesPorNomeCategoria(nomeCategoria);
        return postagensEntidades.stream()
                .map(PostagemDTO::new)
                .collect(Collectors.toList());
    }

    public Set<String> gerarTermosChaveDeTodasPostagens() {
        // Retorna apenas as categorias predefinidas
        return categoriaRepository.findAll().stream()
                .map(Categoria::getNome)
                .collect(Collectors.toSet());
    }

    // Método original que retorna List<Postagem>
    // public List<Postagem> buscarPostagensPorTermoNoConteudo(String termo) { ... }

    // Novo método (ou adaptar o existente) para retornar List<PostagemDTO>
    public List<PostagemDTO> buscarPostagensDTOPorTermoNoConteudo(String termo) {
        // Busca por termo no título ou descrição
        List<Postagem> postagens = postagemRepository
                .findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCase(termo, termo);
        return postagens.stream()
                .map(PostagemDTO::new)
                .collect(Collectors.toList());
    }
}