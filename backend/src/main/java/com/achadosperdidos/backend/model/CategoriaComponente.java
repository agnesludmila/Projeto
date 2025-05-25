package com.achadosperdidos.backend.model;

import java.util.List;

public interface CategoriaComponente {
    String getNome();
    void adicionar(CategoriaComponente componente);
    void remover(CategoriaComponente componente);
    List<CategoriaComponente> getFilhos();
    List<Postagem> buscarItens();
}
