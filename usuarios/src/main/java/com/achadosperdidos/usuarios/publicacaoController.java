package com.achadosperdidos.usuarios;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/publicacoes")
public class publicacaoController {

    @PostMapping
    public ResponseEntity<String> publicarItem(
        @RequestParam("titulo") String titulo,
        @RequestParam("descricao") String descricao,
        @RequestParam("midias") List<MultipartFile> midias) {

        // Caminho da pasta onde as imagens serão salvas
        Path diretorioDestino = Path.of("uploads/");

        // Verificar se o diretório existe, se não, criar
        if (!Files.exists(diretorioDestino)) {
            try {
                Files.createDirectories(diretorioDestino);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Erro ao criar diretório para salvar as mídias.");
            }
        }

        // Salvar os dados: título, descrição e mídias
        System.out.println("Título: " + titulo);
        System.out.println("Descrição: " + descricao);
        System.out.println("Qtd mídias: " + midias.size());

        // Salvar cada mídia
        for (MultipartFile arquivo : midias) {
            Path caminhoArquivo = diretorioDestino.resolve(arquivo.getOriginalFilename());
            try {
                // Salvar a mídia no diretório
                Files.copy(arquivo.getInputStream(), caminhoArquivo, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(500).body("Erro ao salvar arquivo: " + arquivo.getOriginalFilename());
            }
        }

        // Aqui você pode implementar a lógica para salvar os dados no banco de dados (título, descrição, caminhos dos arquivos)

        return ResponseEntity.ok("Publicação recebida com sucesso!");
    }
}
