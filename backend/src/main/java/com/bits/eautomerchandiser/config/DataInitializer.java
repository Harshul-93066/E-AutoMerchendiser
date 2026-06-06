package com.bits.eautomerchandiser.config;

import com.bits.eautomerchandiser.model.*;
import com.bits.eautomerchandiser.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleModelRepository vehicleModelRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // Create default users for each role
        userRepository.save(User.builder().email("manager@test.com").password(passwordEncoder.encode("password123")).fullName("Rajesh Kumar").phone("9876543210").role(Role.MANAGER).build());
        userRepository.save(User.builder().email("supervisor@test.com").password(passwordEncoder.encode("password123")).fullName("Suresh Patel").phone("9876543211").role(Role.SUPERVISOR).build());
        userRepository.save(User.builder().email("mechanic1@test.com").password(passwordEncoder.encode("password123")).fullName("Ravi Sharma").phone("9876543212").role(Role.MECHANIC).build());
        userRepository.save(User.builder().email("mechanic2@test.com").password(passwordEncoder.encode("password123")).fullName("Amit Verma").phone("9876543213").role(Role.MECHANIC).build());
        userRepository.save(User.builder().email("clerk@test.com").password(passwordEncoder.encode("password123")).fullName("Priya Singh").phone("9876543214").role(Role.CLERK).build());
        userRepository.save(User.builder().email("customer@test.com").password(passwordEncoder.encode("password123")).fullName("Vikram Reddy").phone("9876543215").role(Role.CUSTOMER).build());
        userRepository.save(User.builder().email("customer2@test.com").password(passwordEncoder.encode("password123")).fullName("Anita Desai").phone("9876543216").role(Role.CUSTOMER).build());

        // Vehicle Models
        vehicleModelRepository.save(VehicleModel.builder().modelName("Activa 6G").make("Honda").variant("Standard").price(75000.0).stockQuantity(15).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Activa 125").make("Honda").variant("Disc Brake").price(85000.0).stockQuantity(10).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Jupiter").make("TVS").variant("Classic").price(72000.0).stockQuantity(12).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Ntorq 125").make("TVS").variant("Race Edition").price(95000.0).stockQuantity(8).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Pulsar 150").make("Bajaj").variant("Twin Disc").price(110000.0).stockQuantity(10).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Pulsar NS200").make("Bajaj").variant("ABS").price(145000.0).stockQuantity(6).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Splendor Plus").make("Hero").variant("Self Start").price(72000.0).stockQuantity(20).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Glamour").make("Hero").variant("Disc Brake").price(82000.0).stockQuantity(14).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("FZ-S V3").make("Yamaha").variant("Disc").price(120000.0).stockQuantity(7).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("R15 V4").make("Yamaha").variant("Racing Blue").price(185000.0).stockQuantity(5).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Access 125").make("Suzuki").variant("Disc Brake").price(78000.0).stockQuantity(11).year(2024).build());
        vehicleModelRepository.save(VehicleModel.builder().modelName("Classic 350").make("Royal Enfield").variant("Chrome").price(210000.0).stockQuantity(4).year(2024).build());

        // Service Categories
        serviceCategoryRepository.save(ServiceCategory.builder().categoryName("General Service").description("Regular maintenance including oil change, filter check, and basic inspection").charges(1500.0).build());
        serviceCategoryRepository.save(ServiceCategory.builder().categoryName("Oil Change").description("Engine oil and oil filter replacement").charges(800.0).build());
        serviceCategoryRepository.save(ServiceCategory.builder().categoryName("Brake Repair").description("Brake pad replacement and brake system inspection").charges(2000.0).build());
        serviceCategoryRepository.save(ServiceCategory.builder().categoryName("Engine Overhaul").description("Complete engine disassembly, inspection, and reassembly").charges(8000.0).build());
        serviceCategoryRepository.save(ServiceCategory.builder().categoryName("Tire Replacement").description("Front or rear tire replacement with balancing").charges(3000.0).build());
        serviceCategoryRepository.save(ServiceCategory.builder().categoryName("Electrical Work").description("Battery, wiring, lights, and starter motor repair").charges(2500.0).build());

        System.out.println(">>> Sample data initialized successfully!");
    }
}
