package com.bits.eautomerchandiser.repository;

import com.bits.eautomerchandiser.model.DeliveryApprovalStatus;
import com.bits.eautomerchandiser.model.DeliveryRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeliveryRecordRepository extends JpaRepository<DeliveryRecord, Long> {
    List<DeliveryRecord> findByApprovalStatus(DeliveryApprovalStatus approvalStatus);
}
