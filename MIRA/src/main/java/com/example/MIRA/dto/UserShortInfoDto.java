package com.example.MIRA.dto;

import com.example.MIRA.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserShortInfoDto {
    private Long id;
    private String name;
    private String surname;
    private Enum project;

    // Конструктор, геттеры и сеттеры
    public UserShortInfoDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.project = user.getProject();
    }
}
