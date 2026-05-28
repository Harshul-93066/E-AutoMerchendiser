package com.bits.eautomerchandiser.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "delivery_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String type; // NEW_VEHICLE or SERVICED_VEHICLE

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", length = 20)
    @Builder.Default
    private DeliveryApprovalStatus approvalStatus = DeliveryApprovalStatus.PENDING_APPROVAL;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_record_id")
    @JsonIgnoreProperties({"customer", "category", "createdAt"})
    private ServiceRecord serviceRecord;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sales_transaction_id")
    @JsonIgnoreProperties({"recordedBy", "customer"})
    private SalesTransaction salesTransaction;

    @Column(name = "delivery_date", nullable = false)
    private LocalDate deliveryDate;

    @Column(name = "delivered_to", length = 100)
    private String deliveredTo;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recorded_by")
    @JsonIgnoreProperties({"password", "createdAt"})
    private User recordedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
