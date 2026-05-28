package com.bits.eautomerchandiser.repository;

import com.bits.eautomerchandiser.model.ServiceAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceAllocationRepository extends JpaRepository<ServiceAllocation, Long> {

    List<ServiceAllocation> findByMechanicId(Long mechanicId);

    Optional<ServiceAllocation> findByServiceRecordId(Long serviceRecordId);

    @Query("SELECT sa FROM ServiceAllocation sa JOIN FETCH sa.serviceRecord JOIN FETCH sa.mechanic WHERE sa.mechanic.id = :mechanicId AND sa.serviceRecord.status NOT IN ('DELIVERED', 'SERVICED', 'APPROVED_FOR_DELIVERY')")
    List<ServiceAllocation> findActiveByMechanicId(@Param("mechanicId") Long mechanicId);

    @Query("SELECT sa FROM ServiceAllocation sa JOIN FETCH sa.serviceRecord JOIN FETCH sa.mechanic WHERE sa.mechanic.id = :mechanicId")
    List<ServiceAllocation> findAllByMechanicId(@Param("mechanicId") Long mechanicId);

    @Query("SELECT sa.mechanic.fullName, COUNT(sa) FROM ServiceAllocation sa GROUP BY sa.mechanic.id, sa.mechanic.fullName")
    List<Object[]> getMechanicWiseServiceCount();
}
