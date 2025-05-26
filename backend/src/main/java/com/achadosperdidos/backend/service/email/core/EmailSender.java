package com.achadosperdidos.backend.service.email.core;

public interface EmailSender {
    void enviar(String destinatario, String assunto, String corpoHtml);
}