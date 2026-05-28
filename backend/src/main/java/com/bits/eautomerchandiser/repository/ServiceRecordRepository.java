package com.bits.eautomerchandiser.repository;

import com.bits.eautomerchandiser.model.ServiceRecord;
import com.bits.eautomerchandiser.model.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {

    List<ServiceRecord> findByStatus(ServiceStatus status);

    List<ServiceRecord> findByCustomerId(Long customerId);

    @Query("SELECT sr FROM ServiceRecord sr WHERE sr.dateOfSubmission BETWEEN :startDate AND :endDate")
    List<ServiceRecord> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(sr) FROM ServiceRecord sr WHERE sr.status = 'DELIVERED' AND sr.dateOfSubmission BETWEEN :startDate AND :endDate")
    Long countServicedByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(sr.billAmount), 0) FROM ServiceRecord sr WHERE sr.status = 'DELIVERED' AND sr.dateOfSubmission BETWEEN :startDate AND :endDate")
    Double getServiceRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
