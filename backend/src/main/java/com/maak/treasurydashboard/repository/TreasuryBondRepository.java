package com.maak.treasurydashboard.repository;

import com.maak.treasurydashboard.model.TreasuryBond;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TreasuryBondRepository extends JpaRepository<TreasuryBond, Long> {
    
    Optional<TreasuryBond> findByCusip(String cusip);
    
    List<TreasuryBond> findByMaturityOrderByYieldAsc(String maturity);
    
    @Query("SELECT t FROM TreasuryBond t ORDER BY " +
           "CASE t.maturity " +
           "WHEN '2Y' THEN 1 " +
           "WHEN '5Y' THEN 2 " +
           "WHEN '10Y' THEN 3 " +
           "WHEN '30Y' THEN 4 " +
           "END")
    List<TreasuryBond> findAllOrderByMaturity();
}
