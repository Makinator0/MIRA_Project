package com.example.MIRA.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Разрешаем все запросы
                .allowedOrigins("http://localhost:3000")  // Разрешаем только из этого источника
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Разрешаем методы
                .allowedHeaders("*")  // Разрешаем все заголовки
                .allowCredentials(true)  // Разрешаем отправку cookies, если необходимо
                .exposedHeaders("Authorization"); // Разрешить заголовок Authorization
    }
}
