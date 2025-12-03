package com.phoneshop.backend.service;

import com.phoneshop.backend.dto.PhoneResponse;
import com.phoneshop.backend.model.Phone;
import com.phoneshop.backend.model.Role;
import com.phoneshop.backend.model.User;
import com.phoneshop.backend.repository.PhoneRepository;
import com.phoneshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhoneService {

    private final PhoneRepository phoneRepository;
    private final UserRepository userRepository;

    // MOST MÁR DTO-T ADUNK VISSZA
    // ADMIN: minden hirdetés + hirdető neve
    // USER: csak a saját hirdetései
    public List<PhoneResponse> getAllPhones(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User nem található"));

        boolean isAdmin = user.getRole() == Role.ADMIN;

        List<Phone> phones;
        if (isAdmin) {
            // HA ADMIN: Mindent lát
            phones = phoneRepository.findAll();
        } else {
            // HA USER: Csak a sajátját látja
            phones = phoneRepository.findAllByUserId(user.getId());
        }

        // Entitás → DTO
        return phones.stream()
                .map(phone -> mapToResponse(phone, isAdmin))
                .collect(Collectors.toList());
    }

    private PhoneResponse mapToResponse(Phone phone, boolean isAdmin) {
        return PhoneResponse.builder()
                .id(phone.getId())
                .brand(phone.getBrand())
                .model(phone.getModel())
                .description(phone.getDescription())
                .price(phone.getPrice())
                .imageUrl(phone.getImageUrl())
                // Hirdető neve: csak ADMIN esetén töltjük,
                // de biztonsági szempontból amúgy se lát más hirdetését a sima user
                .ownerUsername(isAdmin ? phone.getUser().getUsername() : null)
                .build();
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

        if (!existingPhone.getUser().getId().equals(currentUser.getId()) && currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Nincs jogosultságod törölni ezt a hirdetést!");
        }

        phoneRepository.deleteById(id);
    }
}
