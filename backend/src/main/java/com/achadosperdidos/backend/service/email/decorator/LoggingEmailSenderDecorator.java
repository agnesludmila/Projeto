package com.achadosperdidos.backend.service.email.decorator;

import com.achadosperdidos.backend.service.email.core.EmailSender;

public class LoggingEmailSenderDecorator implements EmailSender {

    private final EmailSender wrappedSender;

    public LoggingEmailSenderDecorator(EmailSender wrappedSender) {
        this.wrappedSender = wrappedSender;
    }

    @Override
    public void enviar(String destinatario, String assunto, String corpoHtml) {
        System.out.println("[LOG] Tentando enviar e-mail para: " + destinatario + " com assunto: " + assunto);

        try {
            wrappedSender.enviar(destinatario, assunto, corpoHtml);
            System.out.println("[LOG] E-mail enviado com sucesso para: " + destinatario);
        } catch (Exception e) {

            System.err.println("[LOG] Falha ao enviar e-mail para: " + destinatario + " - Erro: " + e.getMessage());
            throw e;
        }
    }
}