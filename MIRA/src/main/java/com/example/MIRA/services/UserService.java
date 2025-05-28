package com.example.MIRA.services;

import com.example.MIRA.models.User;
import com.example.MIRA.models.enums.Role;
import com.example.MIRA.repositories.UserRepository;
import org.slf4j.Logger;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class UserService implements UserDetailsService {
    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean createUser(User user, String role, String project) {
        String userEmail = user.getEmail();
        if (userRepository.findByEmail(userEmail) != null) return false;
        user.setActive(true);
        switch (role) {
            case "ROLE_PROJECT_OWNER":
                user.getRoles().add(Role.ROLE_PROJECT_OWNER);
                break;
            case "ROLE_DEVELOPER":
                user.getRoles().add(Role.ROLE_DEVELOPER);
                break;
            case "ROLE_QA":
                user.getRoles().add(Role.ROLE_QA);
                break;
            default:
                break;
        }
        if (project != null) {
            user.setProject(User.Project.valueOf(project));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    public List<User> list() {
        return userRepository.findAll();
    }
    public User getUserByEmail(String principalInfo) {
        String email = extractEmailFromString(principalInfo);
        return userRepository.findByEmail(email);
    }
    public String getUserProjectByEmail(String principalInfo) {
        String email = extractEmailFromString(principalInfo);
        if (email != null) {
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return user.getProject().toString();
            } else {
                return "User not found with email: " + email;
            }
        } else {
            return "Email not found in the input string.";
        }
    }
    public String getUserFirstName(String principalInfo) {
        String email = extractEmailFromString(principalInfo);
        if (email != null) {
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return user.getName();
            } else {
                return "User not found with email: " + email;
            }
        } else {
            return "Email not found in principal info.";
        }
    }

    public String getUserLastName(String principalInfo) {
        String email = extractEmailFromString(principalInfo);
        if (email != null) {
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return user.getSurname();
            } else {
                return "User not found with email: " + email;
            }
        } else {
            return "Email not found in principal info.";
        }
    }
    public Long getUserId(String principalInfo) {
        String email = extractEmailFromString(principalInfo);
        if (email != null) {
            User user = userRepository.findByEmail(email);
            if (user != null) {
                return user.getId();  // Возвращаем ID пользователя
            } else {
                throw new IllegalArgumentException("User not found with email: " + email);
            }
        } else {
            throw new IllegalArgumentException("Email not found in principal info.");
        }
    }
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }



    public String getUserAvatarUrl(String email) {
        User user = userRepository.findByEmail(email);
//        if (user != null) {
//            return user.getAvatarUrl(); // Предполагается, что у пользователя есть поле avatarUrl
//        } else {
            return null; // Возвращаем null, если пользователь не найден или у него нет аватарки
//        }
    }
    private String extractEmailFromString(String input) {
        String emailRegex = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(input);
        return matcher.find() ? matcher.group() : null;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return user;
    }
}

