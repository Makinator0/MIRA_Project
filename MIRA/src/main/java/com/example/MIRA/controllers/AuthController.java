package com.example.MIRA.controllers;

import com.example.MIRA.dto.LoginRequestDTO;
import com.example.MIRA.dto.TokenValidationRequestDTO;
import com.example.MIRA.models.User;
import com.example.MIRA.services.AuthService;
import com.example.MIRA.services.RegistrationService;
import com.example.MIRA.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class AuthController {

    private final RegistrationService registrationService;
    private final AuthService authService;
    private final UserService userService;

    public AuthController(RegistrationService registrationService,  AuthService authService,UserService userService ) {

        this.registrationService = registrationService;
        this.authService = authService;
        this.userService = userService;
    }
    @PostMapping("/auth/validate")
    public ResponseEntity<?> validateToken(@RequestBody TokenValidationRequestDTO tokenRequest) {
        try {
            // Проверка валидности токена
            boolean isValid = authService.validateToken(tokenRequest.getToken());
            if (isValid) {
                return ResponseEntity.ok("Токен валиден");
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Токен недействителен");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка проверки токена");
        }
    }

}
