package com.achadosperdidos.backend.service;

import com.achadosperdidos.backend.model.Categoria;
import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.dto.PostagemDTO; // Certifique-se que este import está correto
import com.achadosperdidos.backend.repository.CategoriaRepository;
import com.achadosperdidos.backend.repository.PostagemRepository;
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
        List<Postagem> todasPostagens = postagemRepository.findAll();
        Set<String> termosUnicos = new HashSet<>();
        List<String> stopwords = Arrays.asList(
                "a", "o", "e", "de", "do", "da", "para", "em", "com", "que", "um", "uma",
                "seu", "sua", "foi", "era", "ser", "ter", "não", "mas", "ou", "os", "as",
                "no", "na", "nos", "nas", "dos", "das", "meu", "minha", "pelo", "pela",
                "este", "esta", "isto", "se", "por", "mais", "como", "quando", "sobre",
                "até", "isso", "ele", "ela", "eles", "elas", "nós", "você", "vocês",
                "muito", "já", "sem", "então", "também", "depois", "ainda", "onde",
                "porque", "mesmo", "qual", "sempre", "mim", "lhe", "nossos", "nossas",
                "meus", "minhas", "seus", "suas", "item", "coisa", "achei", "perdi",
                "encontrei", "procuro", "documento"
        );

        for (Postagem post : todasPostagens) {
            String titulo = (post.getTitulo() == null) ? "" : post.getTitulo().toLowerCase();
            String descricao = (post.getDescricao() == null) ? "" : post.getDescricao().toLowerCase();
            String textoParaAnalise = titulo + " " + descricao;

            String[] palavras = textoParaAnalise
                    .replaceAll("[\\p{Punct}&&[^'-]]+", " ")
                    .replaceAll("\\s+", " ")
                    .split(" ");

            for (String palavra : palavras) {
                String palavraLimpa = palavra.trim();
                if (!palavraLimpa.isEmpty() && palavraLimpa.length() > 3 && !stopwords.contains(palavraLimpa)) {
                    try {
                        Double.parseDouble(palavraLimpa);
                    } catch (NumberFormatException e) {
                        termosUnicos.add(palavraLimpa);
                    }
                }
            }
        }
        return termosUnicos;
    }

    // Método original que retorna List<Postagem>
    // public List<Postagem> buscarPostagensPorTermoNoConteudo(String termo) { ... }

    // Novo método (ou adaptar o existente) para retornar List<PostagemDTO>
    public List<PostagemDTO> buscarPostagensDTOPorTermoNoConteudo(String termo) {
        if (termo == null || termo.trim().isEmpty()) {
            return Collections.emptyList();
        }
        List<Postagem> postagensEntidades = postagemRepository.findByTituloContainingIgnoreCaseOrDescricaoContainingIgnoreCase(termo, termo);
        return postagensEntidades.stream()
                .map(PostagemDTO::new) // Converte para DTO
                .collect(Collectors.toList());
    }
}