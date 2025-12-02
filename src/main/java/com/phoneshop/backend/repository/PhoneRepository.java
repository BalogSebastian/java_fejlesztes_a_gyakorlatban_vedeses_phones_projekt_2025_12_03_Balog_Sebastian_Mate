package com.phoneshop.backend.repository;

import com.phoneshop.backend.model.Phone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhoneRepository extends JpaRepository<Phone, Long> {

    List<Phone> findAllByUserId(Long userId);
}