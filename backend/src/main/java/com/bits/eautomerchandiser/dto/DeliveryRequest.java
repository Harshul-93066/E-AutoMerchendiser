package com.bits.eautomerchandiser.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DeliveryRequest {
    @NotBlank
    private String type; // NEW_VEHICLE or SERVICED_VEHICLE
    private Long serviceRecordId;
    private Long salesTransactionId;
    @NotNull
    private LocalDate deliveryDate;
    private String deliveredTo;
    private String remarks;
}
