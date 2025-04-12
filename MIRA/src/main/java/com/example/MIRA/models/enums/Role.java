package com.example.MIRA.models.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ROLE_PROJECT_OWNER, ROLE_DEVELOPER, ROLE_QA;

    @Override
    public String getAuthority() {
        return name();
    }
}