package com.achadosperdidos.backend.dto;

import com.achadosperdidos.backend.model.Postagem;
import java.time.format.DateTimeFormatter;

public class PostagemDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private String caminhoImagem;
    private String dataCriacao;
    private String nomeUsuario;
    private String fotoPerfil;
    private String email;
    private String contato;
    private Long usuarioId;

    public PostagemDTO(Postagem postagem) {
        this.id = postagem.getId();
        this.titulo = postagem.getTitulo();
        this.descricao = postagem.getDescricao();
        this.caminhoImagem = postagem.getCaminhoImagem();


        if (postagem.getDataCriacao() != null) {
            this.dataCriacao = postagem.getDataCriacao().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } else {
            this.dataCriacao = "";
        }

        if (postagem.getUsuario() != null) {
            this.usuarioId = postagem.getUsuario().getId();
            this.nomeUsuario = postagem.getUsuario().getNome();
            this.email = postagem.getUsuario().getEmail();
            this.contato = postagem.getUsuario().getTelefone();

            if (postagem.getUsuario().getPerfil() != null) {
                this.fotoPerfil = postagem.getUsuario().getPerfil().getFotoPerfil();
            } else {
                this.fotoPerfil = "";
            }
        } else {
            this.usuarioId = null;
            this.nomeUsuario = "";
            this.fotoPerfil = "";
            this.email = "";
            this.contato = "";
        }
    }

    // Getters e setters (pode gerar automaticamente no IDE)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getCaminhoImagem() {
        return caminhoImagem;
    }

    public void setCaminhoImagem(String caminhoImagem) {
        this.caminhoImagem = caminhoImagem;
    }

    public String getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(String dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public String getNomeUsuario() {
        return nomeUsuario;
    }

    public void setNomeUsuario(String nomeUsuario) {
        this.nomeUsuario = nomeUsuario;
    }

    public String getFotoPerfil() {
        return fotoPerfil;
    }

    public void setFotoPerfil(String fotoPerfil) {
        this.fotoPerfil = fotoPerfil;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContato() {
        return contato;
    }

    public void setContato(String contato) {
        this.contato = contato;
    }
}
