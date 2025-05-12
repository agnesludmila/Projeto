package com.achadosperdidos.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class ActivationEmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailAtivacao(String destinatario, String token) {
        try {
            String assunto = "Ativar conta do Achados e Perdidos";
            String link = "http://localhost:63342/MAP/frontend/Activation.html?token=" + token;

            String corpoHtml = """
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #B82727; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333333;">Olá!</h2>
                <p style="font-size: 16px; color: #555555;">
                    Obrigado por se cadastrar no nosso sistema de achados e perdidos. Para ativar sua conta, clique no botão abaixo:
                </p>
                <p style="text-align: center; margin: 30px 0;">
                    <a href="%s" style="background-color: #B82727; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                        Ativar Conta
                    </a>
                </p>
                <p style="font-size: 14px; color: #888888;">
                    Se você não se cadastrou, ignore este e-mail.
                </p>
            </div>
        </body>
    </html>
 
    """.formatted(link);


            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

            helper.setTo(destinatario);
            helper.setSubject(assunto);
            helper.setText(corpoHtml, true); // true = HTML
            helper.setFrom("seu.email@gmail.com"); // ajuste aqui conforme o seu e-mail

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new RuntimeException("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}
