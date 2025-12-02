package com.phoneshop.backend.service;

import com.phoneshop.backend.model.Phone;
import com.phoneshop.backend.model.Role;
import com.phoneshop.backend.model.User;
import com.phoneshop.backend.repository.PhoneRepository;
import com.phoneshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PhoneService {

    private final PhoneRepository phoneRepository;
    private final UserRepository userRepository;

    // --- MÓDOSÍTOTT LOGIKA ---
    // Most már kell neki a username, hogy tudja, kinek a listáját adja vissza
    public List<Phone> getAllPhones(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User nem található"));

        // HA ADMIN: Mindent lát
        if (user.getRole() == Role.ADMIN) {
            return phoneRepository.findAll();
        }
        // HA USER: Csak a sajátját látja
        else {
            return phoneRepository.findAllByUserId(user.getId());
        }
    }

    public Phone getPhoneById(Long id) {
        return phoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Telefon nem található: " + id));
    }

    public Phone savePhone(Phone phone, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User nem található"));
        phone.setUser(user);
        return phoneRepository.save(phone);
    }

    public Phone updatePhone(Long id, Phone updatedPhone, String username) {
        Phone existingPhone = getPhoneById(id);
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User nem található"));

        // Jogosultság ellenőrzés
        if (!existingPhone.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Nincs jogosultságod módosítani ezt a hirdetést!");
        }

        existingPhone.setBrand(updatedPhone.getBrand());
        existingPhone.setModel(updatedPhone.getModel());
        existingPhone.setPrice(updatedPhone.getPrice());
        existingPhone.setDescription(updatedPhone.getDescription());
        existingPhone.setImageUrl(updatedPhone.getImageUrl());

        return phoneRepository.save(existingPhone);
    }

    public void deletePhone(Long id, String username) {
        Phone existingPhone = getPhoneById(id);
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User nem található"));

        // Jogosultság ellenőrzés
        if (!existingPhone.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Nincs jogosultságod törölni ezt a hirdetést!");
        }

        phoneRepository.deleteById(id);
    }
}