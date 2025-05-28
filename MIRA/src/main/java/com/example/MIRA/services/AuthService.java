package com.example.MIRA.services;

import com.example.MIRA.models.User;
import com.example.MIRA.repositories.UserRepository;
import com.example.MIRA.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Autowired
    public AuthService(JwtTokenProvider jwtTokenProvider, @Lazy UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    public String generateAndSetToken(User user) {
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        return jwtTokenProvider.generateToken(
                user.getEmail(),
                user.getId().toString(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getRoles(),
                String.valueOf(user.getProject())
        );
    }
    public boolean validateToken(String token) {
        try {
            // Здесь проверяется валидность токена
            return jwtTokenProvider.validateToken(token); // Пример с использованием JWT
        } catch (Exception e) {
            return false;
        }
    }


}
