package com.bits.eautomerchandiser.controller;

import com.bits.eautomerchandiser.dto.DeliveryRequest;
import com.bits.eautomerchandiser.dto.SalesRequest;
import com.bits.eautomerchandiser.dto.ServiceRecordRequest;
import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clerk")
@RequiredArgsConstructor
public class ClerkController {

    private final ServiceRecordRepository serviceRecordRepository;
    private final SalesTransactionRepository salesTransactionRepository;
    private final DeliveryRecordRepository deliveryRecordRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final UserRepository userRepository;

    @PostMapping("/service-records")
    public ResponseEntity<ServiceRecord> createServiceRecord(@Valid @RequestBody ServiceRecordRequest request) {
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

        return ResponseEntity.ok(serviceRecordRepository.save(record));
    }

    @GetMapping("/service-records")
    public ResponseEntity<List<ServiceRecord>> getAllServiceRecords() {
        return ResponseEntity.ok(serviceRecordRepository.findAll());
    }

    @GetMapping("/service-records/{id}/bill")
    public ResponseEntity<Map<String, Object>> generateBill(@PathVariable Long id) {
        ServiceRecord record = serviceRecordRepository.findById(id)
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

        return ResponseEntity.ok(bill);
    }

    @PostMapping("/sales")
    public ResponseEntity<SalesTransaction> recordSale(@Valid @RequestBody SalesRequest request, Authentication auth) {
        VehicleModel model = vehicleModelRepository.findById(request.getVehicleModelId())
                .orElseThrow(() -> new RuntimeException("Vehicle model not found"));

        Long clerkId = (Long) auth.getCredentials();
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

        if (model.getStockQuantity() != null && model.getStockQuantity() > 0) {
            model.setStockQuantity(model.getStockQuantity() - 1);
            vehicleModelRepository.save(model);
        }

        return ResponseEntity.ok(salesTransactionRepository.save(sale));
    }

    @PostMapping("/deliveries")
    public ResponseEntity<DeliveryRecord> recordDelivery(@Valid @RequestBody DeliveryRequest request, Authentication auth) {
        Long clerkId = (Long) auth.getCredentials();
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

        return ResponseEntity.ok(deliveryRecordRepository.save(delivery));
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryRecord>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryRecordRepository.findAll());
    }

    @GetMapping("/sales")
    public ResponseEntity<List<SalesTransaction>> getAllSales() {
        List<SalesTransaction> allSales = salesTransactionRepository.findAll();
        List<DeliveryRecord> deliveries = deliveryRecordRepository.findAll();
        java.util.Set<Long> deliveredSaleIds = deliveries.stream()
                .filter(d -> d.getSalesTransaction() != null)
                .map(d -> d.getSalesTransaction().getId())
                .collect(java.util.stream.Collectors.toSet());
        List<SalesTransaction> available = allSales.stream()
                .filter(s -> !deliveredSaleIds.contains(s.getId()))
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(available);
    }

    @GetMapping("/vehicle-models")
    public ResponseEntity<List<VehicleModel>> getVehicleModels() {
        return ResponseEntity.ok(vehicleModelRepository.findAll());
    }

    @GetMapping("/service-categories")
    public ResponseEntity<List<ServiceCategory>> getServiceCategories() {
        return ResponseEntity.ok(serviceCategoryRepository.findAll());
    }

    @GetMapping("/customers")
    public ResponseEntity<List<User>> getCustomers() {
        return ResponseEntity.ok(userRepository.findByRole(Role.CUSTOMER));
    }

    @GetMapping("/sales/all")
    public ResponseEntity<List<SalesTransaction>> getAllSalesForBill() {
        return ResponseEntity.ok(salesTransactionRepository.findAll());
    }

    @GetMapping("/sales/{id}/bill")
    public ResponseEntity<Map<String, Object>> generateSalesBill(@PathVariable Long id) {
        SalesTransaction sale = salesTransactionRepository.findById(id)
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

        return ResponseEntity.ok(bill);
    }
}
