package com.achadosperdidos.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonBackReference;
@Entity
public class Postagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    private String caminhoImagem;

    private LocalDateTime dataCriacao = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id")
    @JsonBackReference // Mantido para a relação com Usuario
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria; // Sua categoria estruturada

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "postagem_tag",
            joinColumns = @JoinColumn(name = "postagem_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public String getCaminhoImagem() { return caminhoImagem; }
    public void setCaminhoImagem(String caminhoImagem) { this.caminhoImagem = caminhoImagem; }
    public LocalDateTime getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDateTime dataCriacao) { this.dataCriacao = dataCriacao; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) {this.tags = tags;}
    public void addTag(Tag tag) {
        this.tags.add(tag);
        tag.getPostagens().add(this);
    }
    public void removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getPostagens().remove(this);
    }
}