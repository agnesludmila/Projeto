package com.achadosperdidos.backend.controller;

import com.achadosperdidos.backend.service.PostagemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/postagens")
public class PostagemController {

    @Autowired
    private PostagemService postagemService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> criarPostagem(
            @RequestParam("titulo") String titulo,
            @RequestParam("descricao") String descricao,
            @RequestParam("imagem") List<MultipartFile> imagens,
            @RequestParam("usuarioId") Long usuarioId
    ) throws IOException {
        postagemService.criarPostagem(titulo, descricao, imagens, usuarioId);
        return ResponseEntity.ok("Postagem criada com sucesso!");
    }
}
