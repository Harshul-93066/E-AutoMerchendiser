package com.bits.eautomerchandiser.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ServiceRecordRequest {
    @NotBlank
    private String vehicleNumber;
    @NotBlank
    private String modelName;
    @NotBlank
    private String make;
    private Long customerId;
    private Long categoryId;
    @NotNull
    private LocalDate dateOfSubmission;
    @NotNull
    private LocalDate expectedDeliveryDate;
    private String defects;
}
