package com.phoneshop.backend.controller;

import com.phoneshop.backend.dto.PhoneResponse;
import com.phoneshop.backend.model.Phone;
import com.phoneshop.backend.service.PhoneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3010", allowCredentials = "true")
public class PhoneController {

    private final PhoneService phoneService;

    @GetMapping
    public ResponseEntity<List<PhoneResponse>> getAllPhones(Authentication authentication) {
        // Átadjuk a nevet a service-nek, ő majd eldönti mit láthat
        return ResponseEntity.ok(phoneService.getAllPhones(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Phone> getPhoneById(@PathVariable Long id) {
        return ResponseEntity.ok(phoneService.getPhoneById(id));
    }

    @PostMapping
    public ResponseEntity<Phone> createPhone(@RequestBody Phone phone, Authentication authentication) {
        return new ResponseEntity<>(
                phoneService.savePhone(phone, authentication.getName()),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePhone(@PathVariable Long id, @RequestBody Phone phone, Authentication authentication) {
        try {
            return ResponseEntity.ok(phoneService.updatePhone(id, phone, authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePhone(@PathVariable Long id, Authentication authentication) {
        try {
            phoneService.deletePhone(id, authentication.getName());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
