package com.achadosperdidos.backend.model;

import jakarta.persistence.*;
import java.util.*;

@Entity
public class Categoria implements CategoriaComponente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @ManyToOne
    private Categoria pai;

    @OneToMany(mappedBy = "pai", cascade = CascadeType.ALL)
    private List<Categoria> subCategorias = new ArrayList<>();

    @OneToMany(mappedBy = "categoria")
    private List<Postagem> postagens = new ArrayList<>();

    public Categoria() {}
    public Categoria(String nome) {
        this.nome = nome;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Categoria getPai() { return pai; }
    public void setPai(Categoria pai) { this.pai = pai; }

    @Override
    public void adicionar(CategoriaComponente componente) {
        if (componente instanceof Categoria) {
            subCategorias.add((Categoria) componente);
        }
    }

    @Override
    public void remover(CategoriaComponente componente) {
        subCategorias.remove(componente);
    }

    @Override
    public List<CategoriaComponente> getFilhos() {
        return new ArrayList<>(subCategorias);
    }

    @Override
    public List<Postagem> buscarItens() {
        List<Postagem> todas = new ArrayList<>(postagens);
        for (Categoria sub : subCategorias) {
            todas.addAll(sub.buscarItens());
        }
        return todas;
    }
}
