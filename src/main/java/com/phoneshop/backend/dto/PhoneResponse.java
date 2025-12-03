package com.phoneshop.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PhoneResponse {
    private Long id;
    private String brand;
    private String model;
    private String description;
    private Double price;
    private String imageUrl;

    private String ownerUsername;
}
