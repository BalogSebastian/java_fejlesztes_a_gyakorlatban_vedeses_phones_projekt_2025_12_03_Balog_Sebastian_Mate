package com.phoneshop.backend.service;

import com.phoneshop.backend.model.User;
import com.phoneshop.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {


        // 1. Megkeressük a felhasználót a saját adatbázisunkban


        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Felhasználó nem található: " + username));


        // 2. Átalakítjuk (mapping) a Spring Security saját User objektumává.
        // Fontos: A jelszót itt már nem kell ellenőrizni, azt a Spring megcsinálja a háttérben
        // azzal a PasswordEncoder-rel, amit az előző lépésben állítottunk be.



        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),


                // Itt adjuk át a jogosultságot (ROLE_USER vagy RO
                // LE_ADMIN)


                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}