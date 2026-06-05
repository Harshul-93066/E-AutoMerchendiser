package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.model.SalesTransaction;
import com.bits.eautomerchandiser.model.ServiceRecord;
import com.bits.eautomerchandiser.repository.SalesTransactionRepository;
import com.bits.eautomerchandiser.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final ServiceRecordRepository serviceRecordRepository;
    private final SalesTransactionRepository salesTransactionRepository;

    @Override
    public List<ServiceRecord> getVehicleStatus(Long customerId) {
        return serviceRecordRepository.findByCustomerId(customerId);
    }

    @Override
    public List<SalesTransaction> getPurchaseHistory(Long customerId) {
        return salesTransactionRepository.findByCustomerId(customerId);
    }
}