package com.bits.eautomerchandiser.repository;

import com.bits.eautomerchandiser.model.SalesTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesTransactionRepository extends JpaRepository<SalesTransaction, Long> {

    List<SalesTransaction> findBySaleDateBetween(LocalDate startDate, LocalDate endDate);

    List<SalesTransaction> findByCustomerId(Long customerId);

    @Query("SELECT st.vehicleModel.modelName, COUNT(st), SUM(st.salePrice) FROM SalesTransaction st WHERE st.saleDate BETWEEN :startDate AND :endDate GROUP BY st.vehicleModel.modelName")
    List<Object[]> getSalesGroupedByModel(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT st.vehicleModel.make, COUNT(st), SUM(st.salePrice) FROM SalesTransaction st WHERE st.saleDate BETWEEN :startDate AND :endDate GROUP BY st.vehicleModel.make")
    List<Object[]> getSalesGroupedByMake(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(st.salePrice), 0) FROM SalesTransaction st WHERE st.saleDate BETWEEN :startDate AND :endDate")
    Double getSalesRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
