package com.example.MIRA.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // Простой брокер сообщений для всех клиентов
        config.setApplicationDestinationPrefixes("/app"); // Установим /kanban как префикс для отправки сообщений
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/kanban-websocket")
                .setAllowedOrigins("https://554d-31-202-42-109.ngrok-free.app", "http://localhost:8080, http://localhost:8080/api/tickets, http://localhost:3000") // List allowed origins here
                .withSockJS(); // Configures SockJS fallback options
    }
}
