package com.achadosperdidos.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailAtivacao(String destinatario, String tokenAtivacao) {
        String assunto = "Ativar conta do Achados e Perdidos";
        String link = "http://localhost:63342/MAP/frontend/Activation.html?token=" + tokenAtivacao;

        String corpo = """
            Olá!

            Obrigado por se cadastrar. Para ativar sua conta, clique no link abaixo:

            %s

            Se você não se cadastrou, ignore este email.
            """.formatted(link);

        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destinatario);
        mensagem.setSubject(assunto);
        mensagem.setText(corpo);

        mailSender.send(mensagem);
    }
}
