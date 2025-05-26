package com.achadosperdidos.backend.service;

import com.achadosperdidos.backend.service.email.core.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service
public class AtivacaoEmailService {

    private final EmailSender emailSender;
    private final String frontendBaseUrl;
    private final String activationPath;

    @Autowired
    public AtivacaoEmailService(
            @Qualifier("javaMailEmailSender") EmailSender emailSender,
            @Value("${app.frontend.base-url}") String frontendBaseUrl,
            @Value("${app.frontend.activation-path}") String activationPath) {
        this.emailSender = emailSender;
        this.frontendBaseUrl = frontendBaseUrl;
        this.activationPath = activationPath;
    }

    public void enviarEmailAtivacao(String destinatario, String token) {
        String assunto = "Ativar conta do Achados e Perdidos";
        String link = frontendBaseUrl + activationPath + "?token=" + token;

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

        emailSender.enviar(destinatario, assunto, corpoHtml);
    }
}