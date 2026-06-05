package com.bits.eautomerchandiser.service;

import com.bits.eautomerchandiser.dto.DeliveryRequest;
import com.bits.eautomerchandiser.dto.SalesRequest;
import com.bits.eautomerchandiser.dto.ServiceRecordRequest;
import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClerkServiceImpl implements ClerkService {

    private final ServiceRecordRepository serviceRecordRepository;
    private final SalesTransactionRepository salesTransactionRepository;
    private final DeliveryRecordRepository deliveryRecordRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ServiceRecord createServiceRecord(ServiceRecordRequest request) {
        ServiceRecord record = ServiceRecord.builder()
                .vehicleNumber(request.getVehicleNumber())
                .modelName(request.getModelName())
                .make(request.getMake())
                .dateOfSubmission(request.getDateOfSubmission())
                .expectedDeliveryDate(request.getExpectedDeliveryDate())
                .defects(request.getDefects())
                .status(ServiceStatus.RECEIVED)
                .build();

        if (request.getCustomerId() != null) {
            record.setCustomer(userRepository.findById(request.getCustomerId()).orElse(null));
        }
        if (request.getCategoryId() != null) {
            record.setCategory(serviceCategoryRepository.findById(request.getCategoryId()).orElse(null));
        }

        return serviceRecordRepository.save(record);
    }

    @Override
    public List<ServiceRecord> getAllServiceRecords() {
        return serviceRecordRepository.findAll();
    }

    @Override
    @Transactional
    public Map<String, Object> generateServiceBill(Long serviceRecordId) {
        ServiceRecord record = serviceRecordRepository.findById(serviceRecordId)
                .orElseThrow(() -> new RuntimeException("Service record not found"));

        double amount = 0;
        if (record.getBillAmount() != null && record.getBillAmount() > 0) {
            amount = record.getBillAmount();
        } else if (record.getCategory() != null && record.getCategory().getCharges() != null) {
            amount = record.getCategory().getCharges();
        }
        record.setBillAmount(amount);
        serviceRecordRepository.save(record);

        Map<String, Object> bill = new HashMap<>();
        bill.put("serviceRecordId", record.getId());
        bill.put("vehicleNumber", record.getVehicleNumber());
        bill.put("modelName", record.getModelName());
        bill.put("make", record.getMake());
        bill.put("category", record.getCategory() != null ? record.getCategory().getCategoryName() : "N/A");
        bill.put("defects", record.getDefects());
        bill.put("workDescription", record.getWorkDescription());
        bill.put("billAmount", amount);
        bill.put("dateOfSubmission", record.getDateOfSubmission());
        bill.put("status", record.getStatus());

        return bill;
    }

    @Override
    @Transactional
    public SalesTransaction recordSale(SalesRequest request, Long clerkId) {
        VehicleModel model = vehicleModelRepository.findById(request.getVehicleModelId())
                .orElseThrow(() -> new RuntimeException("Vehicle model not found"));

        User clerk = userRepository.findById(clerkId).orElse(null);

        SalesTransaction sale = SalesTransaction.builder()
                .vehicleModel(model)
                .vehicleNumber(request.getVehicleNumber())
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .salePrice(request.getSalePrice())
                .saleDate(request.getSaleDate())
                .recordedBy(clerk)
                .build();

        if (request.getCustomerId() != null) {
            sale.setCustomer(userRepository.findById(request.getCustomerId()).orElse(null));
        }

        // Auto-decrement stock
        if (model.getStockQuantity() != null && model.getStockQuantity() > 0) {
            model.setStockQuantity(model.getStockQuantity() - 1);
            vehicleModelRepository.save(model);
        }

        return salesTransactionRepository.save(sale);
    }

    @Override
    public List<SalesTransaction> getSalesWithoutDelivery() {
        List<SalesTransaction> allSales = salesTransactionRepository.findAll();
        List<DeliveryRecord> deliveries = deliveryRecordRepository.findAll();
        
        Set<Long> deliveredSaleIds = deliveries.stream()
                .filter(d -> d.getSalesTransaction() != null)
                .map(d -> d.getSalesTransaction().getId())
                .collect(Collectors.toSet());
        
        return allSales.stream()
                .filter(s -> !deliveredSaleIds.contains(s.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<SalesTransaction> getAllSales() {
        return salesTransactionRepository.findAll();
    }

    @Override
    public Map<String, Object> generateSalesBill(Long saleId) {
        SalesTransaction sale = salesTransactionRepository.findById(saleId)
                .orElseThrow(() -> new RuntimeException("Sales transaction not found"));

        Map<String, Object> bill = new HashMap<>();
        bill.put("saleId", sale.getId());
        bill.put("customerName", sale.getCustomerName());
        bill.put("customerPhone", sale.getCustomerPhone());
        bill.put("vehicleNumber", sale.getVehicleNumber());
        bill.put("modelName", sale.getVehicleModel() != null ? sale.getVehicleModel().getModelName() : "N/A");
        bill.put("make", sale.getVehicleModel() != null ? sale.getVehicleModel().getMake() : "N/A");
        bill.put("variant", sale.getVehicleModel() != null ? sale.getVehicleModel().getVariant() : "N/A");
        bill.put("salePrice", sale.getSalePrice());
        bill.put("saleDate", sale.getSaleDate());
        bill.put("recordedBy", sale.getRecordedBy() != null ? sale.getRecordedBy().getFullName() : "N/A");

        return bill;
    }

    @Override
    @Transactional
    public DeliveryRecord recordDelivery(DeliveryRequest request, Long clerkId) {
        User clerk = userRepository.findById(clerkId).orElse(null);

        DeliveryRecord delivery = DeliveryRecord.builder()
                .type(request.getType())
                .deliveryDate(request.getDeliveryDate())
                .deliveredTo(request.getDeliveredTo())
                .remarks(request.getRemarks())
                .recordedBy(clerk)
                .approvalStatus(DeliveryApprovalStatus.PENDING_APPROVAL)
                .build();

        if (request.getServiceRecordId() != null) {
            ServiceRecord sr = serviceRecordRepository.findById(request.getServiceRecordId()).orElse(null);
            delivery.setServiceRecord(sr);
        }
        if (request.getSalesTransactionId() != null) {
            delivery.setSalesTransaction(salesTransactionRepository.findById(request.getSalesTransactionId()).orElse(null));
        }

        return deliveryRecordRepository.save(delivery);
    }

    @Override
    public List<DeliveryRecord> getAllDeliveries() {
        return deliveryRecordRepository.findAll();
    }

    @Override
    public List<VehicleModel> getVehicleModels() {
        return vehicleModelRepository.findAll();
    }

    @Override
    public List<ServiceCategory> getServiceCategories() {
        return serviceCategoryRepository.findAll();
    }

    @Override
    public List<User> getCustomers() {
        return userRepository.findByRole(Role.CUSTOMER);
    }
}