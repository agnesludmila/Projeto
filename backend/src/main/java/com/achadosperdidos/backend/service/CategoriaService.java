package com.achadosperdidos.backend.service;

import com.achadosperdidos.backend.model.Categoria;
import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Postagem> buscarPorCategoriaEUsuario(String nomeCategoria, Long usuarioId) {
        Optional<Categoria> categoria = categoriaRepository.findByNome(nomeCategoria);

        if (categoria.isPresent()) {
            return categoria.get().buscarItens()
                    .stream()
                    .filter(p -> p.getUsuario() != null && p.getUsuario().getId().equals(usuarioId))
                    .toList();
        }

        return Collections.emptyList();
    }

    public List<Postagem> buscarPorNomeCategoria(String nomeCategoria) {
        Optional<Categoria> categoria = categoriaRepository.findByNome(nomeCategoria);

        return categoria.map(Categoria::buscarItens)
                .orElse(Collections.emptyList());
    }


}
