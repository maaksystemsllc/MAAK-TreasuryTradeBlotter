package com.maak.treasurydashboard.repository;

import com.maak.treasurydashboard.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TradeRepository extends JpaRepository<Trade, Long> {
    
    List<Trade> findByStatus(String status);
    
    List<Trade> findByTrader(String trader);
    
    List<Trade> findByCusip(String cusip);
    
    List<Trade> findByCounterparty(String counterparty);
    
    @Query("SELECT t FROM Trade t WHERE t.status = :status ORDER BY t.timestamp DESC")
    List<Trade> findByStatusOrderByTimestampDesc(@Param("status") String status);
    
    @Query("SELECT t FROM Trade t ORDER BY t.timestamp DESC")
    List<Trade> findAllOrderByTimestampDesc();
}
