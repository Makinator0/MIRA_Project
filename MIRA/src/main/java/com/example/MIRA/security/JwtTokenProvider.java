package com.example.MIRA.security;

import com.example.MIRA.models.enums.Role;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.Set;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Генерация токена с дополнительной информацией
    public String generateToken(String username, String userId, String firstName, String lastName, String Email, Set<Role> roles, String project) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);


        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("firstName", firstName)
                .claim("lastName", lastName)
                .claim("email", Email)
                .claim("project", project)
                .claim("role", roles.toString())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS512)
                .compact();
    }

    // Извлечение информации из токена
    public static String extractJwtFromRequest(HttpServletRequest request) {
        // Сначала пытаемся извлечь токен из заголовка
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Убираем "Bearer " из строки
        }

        // Если токен не был найден в заголовке, проверяем куки
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
            return claims.get("email", String.class);  // Извлекаем нужное поле из токена
        } catch (JwtException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }


    public boolean validateToken(String token) {
        try {
            // Попытка извлечь данные из токена
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)  // Используйте ваш ключ для проверки подписи
                    .build()
                    .parseClaimsJws(token);
            return true;  // Если не было исключений, токен валиден
        } catch (ExpiredJwtException e) {
            System.out.println("Token expired: " + e.getMessage());
        } catch (JwtException e) {
            System.out.println("Invalid token: " + e.getMessage());
        }
        return false;  // Если есть ошибки, токен недействителен
    }
}