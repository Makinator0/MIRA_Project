package com.example.MIRA.services;

import com.example.MIRA.models.User;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class RegistrationService {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    public String registerUser(
            String name,
            String surname,
            String email,
            String numberPhone,
            String password,
            String role,
            String project) {
        System.out.println("Chert");
        // Создаем нового пользователя
        User user = new User();
        user.setName(name);
        user.setSurname(surname);
        user.setEmail(email);
        user.setNumberPhone(numberPhone);
        user.setPassword(password);
        System.out.println("PES");
        // Добавляем пользователя через UserService
        boolean isCreated = userService.createUser(user, role, project);
        if (!isCreated) {
            throw new IllegalArgumentException("User registration failed.");
        }
        // Генерация токена через AuthService
        System.out.println("Tut");
        return authService.generateAndSetToken( user);
    }
}
