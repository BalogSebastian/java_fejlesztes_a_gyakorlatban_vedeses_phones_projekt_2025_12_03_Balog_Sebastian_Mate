package com.phoneshop.backend.service;

import com.phoneshop.backend.model.Phone;
import com.phoneshop.backend.model.Role;
import com.phoneshop.backend.model.User;
import com.phoneshop.backend.repository.PhoneRepository;
import com.phoneshop.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PhoneServiceTest {

    @InjectMocks
    private PhoneService phoneService;
    @Mock
    private PhoneRepository phoneRepository;
    @Mock
    private UserRepository userRepository;

    private User adminUser;
    private User regularUser;

    @BeforeEach
    void setUp() {
        adminUser = User.builder().id(1L).username("admin").role(Role.ADMIN).build();
        regularUser = User.builder().id(2L).username("janos").role(Role.USER).build();
    }

    @Test
    void getAllPhones_AdminRole_ShouldReturnAllPhones() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(adminUser));
        when(phoneRepository.findAll()).thenReturn(Arrays.asList(new Phone(), new Phone()));

        phoneService.getAllPhones("admin");

        verify(phoneRepository, times(1)).findAll();
        verify(phoneRepository, times(0)).findAllByUserId(anyLong());
    }

    @Test
    void getAllPhones_UserRole_ShouldReturnOnlyOwnPhones() {
        when(userRepository.findByUsername("janos")).thenReturn(Optional.of(regularUser));
        when(phoneRepository.findAllByUserId(regularUser.getId())).thenReturn(Arrays.asList(new Phone()));

        phoneService.getAllPhones("janos");

        verify(phoneRepository, times(1)).findAllByUserId(2L);
        verify(phoneRepository, times(0)).findAll();
    }
}