package com.achadosperdidos.backend.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Entity
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50) // Definindo um tamanho e garantindo unicidade
    private String nome;

    @ManyToMany(mappedBy = "tags")
    private Set<Postagem> postagens = new HashSet<>();

    public Tag() {
    }

    public Tag(String nome) {
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Set<Postagem> getPostagens() {
        return postagens;
    }

    public void setPostagens(Set<Postagem> postagens) {
        this.postagens = postagens;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tag tag = (Tag) o;
        return Objects.equals(nome, tag.nome);
    }

    @Override
    public int hashCode() {
        return Objects.hash(nome);
    }
}