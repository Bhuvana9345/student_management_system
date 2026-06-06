package com.college.sms.service;

import com.college.sms.entity.Notification;
import com.college.sms.repository.NotificationRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender sender;
    private final NotificationRepository notifications;
    public EmailService(JavaMailSender sender, NotificationRepository notifications) {
        this.sender = sender;
        this.notifications = notifications;
    }
    public void notify(String to, String subject, String body) {
        Notification note = new Notification();
        note.setRecipient(to);
        note.setSubject(subject);
        note.setMessage(body);
        notifications.save(note);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            sender.send(message);
        } catch (Exception ignored) {
            // Email servers are optional in local development; the notification row is still saved.
        }
    }
}
