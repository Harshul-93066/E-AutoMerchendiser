package com.bits.eautomerchandiser.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SalesRequest {
    @NotNull
    private Long vehicleModelId;
    private String vehicleNumber;
    @NotBlank
    private String customerName;
    private String customerPhone;
    private Long customerId;
    @NotNull
    private Double salePrice;
    @NotNull
    private LocalDate saleDate;
}
