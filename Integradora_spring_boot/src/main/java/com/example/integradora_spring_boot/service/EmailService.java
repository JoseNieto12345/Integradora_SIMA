package com.example.integradora_spring_boot.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoRecuperacion(String destinatario, String codigo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("20243ds118@utez.edu.mx");
            helper.setTo(destinatario);
            helper.setSubject("🔑 Código de Recuperación - SIMA");

            // Diseño HTML del correo
            String contenidoHtml =
                    "<div style='font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px; text-align: center;'>" +
                            "<h2 style='color: #007bff;'>SIMA</h2>" +
                            "<p style='font-size: 16px; color: #555;'>Hola,</p>" +
                            "<p style='font-size: 16px; color: #555;'>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de seguridad:</p>" +
                            "<div style='background-color: #f8f9fa; border: 2px dashed #007bff; padding: 15px; margin: 20px 0;'>" +
                            "<span style='font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;'>" + codigo + "</span>" +
                            "</div>" +
                            "<p style='font-size: 12px; color: #999;'>Este código expirará pronto. Si no solicitaste este cambio, ignora este mensaje.</p>" +
                            "<hr style='border: 0; border-top: 1px solid #eee;'>" +
                            "<p style='font-size: 11px; color: #aaa;'>© 2026 SIMA - Sistema de Gestión de Tareas</p>" +
                            "</div>";

            helper.setText(contenidoHtml, true); // El 'true' activa el modo HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo con diseño", e);
        }
    }
}