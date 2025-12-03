package com.phoneshop.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;

    private boolean admin;

    private String adminPassword;
}
