package com.phoneshop.backend.controller;

import com.phoneshop.backend.dto.RegisterRequest;
import com.phoneshop.backend.model.Role;
import com.phoneshop.backend.model.User;
import com.phoneshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

// Ez a sor engedélyezi a kommunikációt a frontenddel (3010)

@CrossOrigin(origins = "http://localhost:3010", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Visszaadja a jelenleg bejelentkezett felhasználó adatait.
     * @param authentication a Spring Security által biztosított hitelesítési objektum.
     * @return a felhasználó adatai.
     */


    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User nem található"));
        return ResponseEntity.ok(user);
    }


    /**
     * Új felhasználó regisztrálása és a szerepkör (Role) kiosztása.
     * Ha a felhasználónév 'admin', Admin szerepkört kap.
     * @param request a regisztrációs űrlap adatai.
     * @return sikerüzenet vagy hibaüzenet.
     */


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Hiba: Ez a felhasználónév már foglalt!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Hiba: Ezzel az email címmel már regisztráltak!");
        }

        // --- ADMIN LOGIKA: Bárki regisztrálhat, de csak az "admin" nevű kap Admin jogot. ---




        Role role = Role.USER;
        if (request.getUsername().equalsIgnoreCase("admin")) {
            role = Role.ADMIN;
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("Sikeres regisztráció! (" + role + " jogosultsággal)");
    }
}