package com.achadosperdidos.backend.service;

import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.repository.PostagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostagemCleanupService {

    @Autowired
    private PostagemRepository postagemRepository;

    /**
     * Remove postagens com mais de 30 dias de existência e apaga a imagem associada do sistema de arquivos.
     * Este processo é executado automaticamente todos os dias às 03:00 da manhã.
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void apagarPostagensAntigas() {
        LocalDateTime limite = LocalDateTime.now().minusDays(30);
        List<Postagem> antigas = postagemRepository.findByDataCriacaoBefore(limite);

        for (Postagem postagem : antigas) {
            try {
                Path imagemPath = Paths.get(postagem.getCaminhoImagem());
                if (Files.exists(imagemPath)) {
                    Files.delete(imagemPath);
                }
            } catch (IOException e) {
                System.err.println("Erro ao deletar imagem da postagem ID " + postagem.getId());
                e.printStackTrace();
            }

            postagemRepository.delete(postagem);
        }
    }
}
