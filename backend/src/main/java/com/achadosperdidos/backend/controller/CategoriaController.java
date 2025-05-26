package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.dto.PostagemDTO; // Import
import com.achadosperdidos.backend.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // Import
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/postagem")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/{nome}/postagens")
    public ResponseEntity<List<PostagemDTO>> listarPostagensPorCategoria(@PathVariable String nome) {
        return ResponseEntity.ok(categoriaService.buscarDTOPorNomeCategoria(nome));
    }

    @GetMapping("/{nome}/usuario/{id}/postagens")
    public ResponseEntity<List<PostagemDTO>> listarPostagensPorCategoriaEUsuario(
            @PathVariable String nome,
            @PathVariable Long id) {
        return ResponseEntity.ok(categoriaService.buscarDTOPorCategoriaEUsuario(nome, id));
    }

    @GetMapping("/sugestoes-termos")
    public Set<String> obterSugestoesDeTermos() {
        return categoriaService.gerarTermosChaveDeTodasPostagens();
    }

    @GetMapping("/por-termo/{termo}")
    public ResponseEntity<List<PostagemDTO>> buscarPostagensPorTermoDinamico(@PathVariable String termo) {
        return ResponseEntity.ok(categoriaService.buscarPostagensDTOPorTermoNoConteudo(termo));
    }
}