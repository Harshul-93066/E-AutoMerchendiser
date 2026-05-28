package com.bits.eautomerchandiser.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "service_allocations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_record_id", unique = true)
    private ServiceRecord serviceRecord;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mechanic_id")
    private User mechanic;

    @Column(name = "allocated_date")
    private LocalDate allocatedDate;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
