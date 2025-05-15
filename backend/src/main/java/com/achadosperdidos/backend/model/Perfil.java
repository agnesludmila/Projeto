package com.achadosperdidos.backend.model;

import jakarta.persistence.*;

@Entity
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String biografia = "";
    private String fotoPerfil = "";
    private int qntComentario = 0;
    private int qntPosts = 0;

    @OneToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", unique = true)
    private Usuario usuario;

    public Perfil(){}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBiografia() {
        return biografia;
    }

    public void setBiografia(String biografia) {
        this.biografia = biografia;
    }
    @Lob
    @Column(name = "foto_perfil", columnDefinition = "TEXT")
    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public int getQntComentario() {
        return qntComentario;
    }

    public void setQntComentario(int qntComentario) {
        this.qntComentario = qntComentario;
    }

    public int getQntPosts() {
        return qntPosts;
    }

    public void setQntPosts(int qntPosts) {
        this.qntPosts = qntPosts;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
        if (usuario != null && usuario.getPerfil() != this) {
            usuario.setPerfil(this);
        }
    }
}
