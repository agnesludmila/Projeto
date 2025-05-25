package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // Buscar todas as postagens de uma categoria
    @GetMapping("/{nome}/postagens")
    public List<Postagem> listarPostagensPorCategoria(@PathVariable String nome) {
        return categoriaService.buscarPorNomeCategoria(nome);
    }

    // Buscar por categoria e usuário
    @GetMapping("/{nome}/usuario/{id}/postagens")
    public List<Postagem> listarPostagensPorCategoriaEUsuario(
            @PathVariable String nome,
            @PathVariable Long id) {
        return categoriaService.buscarPorCategoriaEUsuario(nome, id);
    }
}
