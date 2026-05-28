package com.bits.eautomerchandiser.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllocationRequest {
    private Long serviceRecordId;
    private Long mechanicId;
    private String notes;
}
