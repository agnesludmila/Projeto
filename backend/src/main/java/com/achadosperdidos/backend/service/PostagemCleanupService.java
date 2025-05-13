package com.achadosperdidos.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.achadosperdidos.backend.model.Postagem;
import com.achadosperdidos.backend.repository.PostagemRepository;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostagemCleanupService {

    @Autowired
    private PostagemRepository postagemRepository;

    @Scheduled(cron = "0 0 3 * * *")
    public void apagarPostagensAntigas() {
        LocalDateTime limite = LocalDateTime.now().minusDays(30);
        List<Postagem> antigas = postagemRepository.findByDataCriacaoBefore(limite);

        for (Postagem p : antigas) {
            try {
                Files.deleteIfExists(Paths.get(p.getCaminhoImagem()));
            } catch (IOException e) {
                e.printStackTrace();  // Tratamento de erro
            }
            postagemRepository.delete(p);  // Apaga a postagem
        }
    }
}
