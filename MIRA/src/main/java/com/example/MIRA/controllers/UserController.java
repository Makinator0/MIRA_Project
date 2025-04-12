package com.example.MIRA.controllers;


import com.example.MIRA.dto.LoginRequestDTO;
import com.example.MIRA.dto.RegistrationRequestDTO;
import com.example.MIRA.models.User;
import com.example.MIRA.security.JwtTokenProvider;
import com.example.MIRA.services.AuthService;
import com.example.MIRA.services.RegistrationService;
import com.example.MIRA.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class UserController {

    private final RegistrationService registrationService;
    private final AuthService authService;
    private final UserService userService;


    public UserController(RegistrationService registrationService,  AuthService authService,UserService userService ) {

        this.registrationService = registrationService;

        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            // Аутентификация
            User user = (User) userService.loadUserByUsername(loginRequest.getEmail());
            System.out.println(user.getPassword().toString());
            System.out.println(user.getEmail().toString());

            // Генерация токена
            String token = authService.generateAndSetToken(user);

            // Отправка токена в заголовке
            return ResponseEntity.ok().header("Authorization", "Bearer " + token).body("Успешный вход");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Неверный логин или пароль");
        }
    }
    @Operation(summary = "Регистрация пользователя", description = "Создание нового пользователя")
    @PostMapping("/registration")
    public ResponseEntity<?> register(@RequestBody RegistrationRequestDTO registrationRequest) {
        try {
            System.out.println("Starting registration process for user: " + registrationRequest.getEmail());

            String token = registrationService.registerUser(
                    registrationRequest.getName(),
                    registrationRequest.getSurname(),
                    registrationRequest.getEmail(),
                    registrationRequest.getNumberPhone(),
                    registrationRequest.getPassword(),
                    registrationRequest.getRole(),
                    registrationRequest.getProject()
            );

            System.out.println("User registered successfully: " + registrationRequest.getEmail());

            // Add the Authorization token to the response header
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + token)
                    .body("Успешный вход");
        } catch (IllegalArgumentException e) {
            System.err.println("Registration error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid registration data: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error during registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed");
        }
    }




}

