package com.achadosperdidos.backend.service.email.core;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
// Importe a interface correta do Spring
import org.springframework.mail.javamail.JavaMailSender; // << IMPORTANTE: Esta é a interface do Spring
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component("javaMailEmailSender")
public class JavaEmailSender implements EmailSender {


    private final org.springframework.mail.javamail.JavaMailSender springMailSender;
    private final String remetente;

    @Autowired
    public JavaEmailSender(org.springframework.mail.javamail.JavaMailSender springMailSender,
                           @Value("${spring.mail.username}") String remetente) {
        this.springMailSender = springMailSender;
        this.remetente = remetente;
    }

    @Override
    public void enviar(String destinatario, String assunto, String corpoHtml) {
        try {
            MimeMessage mimeMessage = springMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(corpoHtml, true);
            helper.setFrom(remetente);

            springMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Erro ao enviar e-mail para " + destinatario + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage(), e);
        }
    }
}