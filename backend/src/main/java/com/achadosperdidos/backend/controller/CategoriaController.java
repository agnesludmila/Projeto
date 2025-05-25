package com.achadosperdidos.backend.controller;

// Adicione o import para PostagemDTO e ResponseEntity se for retornar ResponseEntity
import java.util.List;
import java.util.Set; // Pode não ser mais necessário aqui se sempre usar DTO

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping; // Para ResponseEntity
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.achadosperdidos.backend.dto.PostagemDTO;
import com.achadosperdidos.backend.service.CategoriaService;

@RestController
@RequestMapping("/postagem")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping("/{nome}/postagens")
    public ResponseEntity<List<PostagemDTO>> listarPostagensPorCategoria(@PathVariable String nome) {
        List<PostagemDTO> dtos = categoriaService.buscarDTOPorNomeCategoria(nome);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{nome}/usuario/{id}/postagens")
    public ResponseEntity<List<PostagemDTO>> listarPostagensPorCategoriaEUsuario(
            @PathVariable String nome,
            @PathVariable Long id) {
        List<PostagemDTO> dtos = categoriaService.buscarDTOPorCategoriaEUsuario(nome, id);
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/sugestoes-termos")
    public Set<String> obterSugestoesDeTermos() {
        return categoriaService.gerarTermosChaveDeTodasPostagens();
    }

    @GetMapping("/por-termo/{termo}")
    public ResponseEntity<List<PostagemDTO>> buscarPostagensPorTermoDinamico(@PathVariable String termo) {
        List<PostagemDTO> dtos = categoriaService.buscarPostagensDTOPorTermoNoConteudo(termo);
        return ResponseEntity.ok(dtos);
    }
}