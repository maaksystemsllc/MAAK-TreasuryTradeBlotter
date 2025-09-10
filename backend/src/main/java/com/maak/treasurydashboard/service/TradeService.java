package com.maak.treasurydashboard.service;

import com.maak.treasurydashboard.model.Trade;
import com.maak.treasurydashboard.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TradeService {
    
    @Autowired
    private TradeRepository tradeRepository;
    
    @Autowired
    private WebSocketService webSocketService;
    
    public Trade bookTrade(Trade trade) {
        // Set timestamp and initial status
        trade.setTimestamp(LocalDateTime.now());
        if (trade.getStatus() == null) {
            trade.setStatus("PENDING");
        }
        
        // Save the trade
        Trade savedTrade = tradeRepository.save(trade);
        
        // Simulate trade execution (in real system this would be more complex)
        savedTrade.setStatus("EXECUTED");
        savedTrade = tradeRepository.save(savedTrade);
        
        // Notify WebSocket clients
        webSocketService.broadcastTradeUpdate(savedTrade);
        
        return savedTrade;
    }
    
    public List<Trade> getAllTrades() {
        return tradeRepository.findAllOrderByTimestampDesc();
    }
    
    public Optional<Trade> getTradeById(Long id) {
        return tradeRepository.findById(id);
    }
    
    public List<Trade> getTradesByStatus(String status) {
        return tradeRepository.findByStatusOrderByTimestampDesc(status);
    }
    
    public List<Trade> getTradesByTrader(String trader) {
        return tradeRepository.findByTrader(trader);
    }
    
    public List<Trade> getTradesByCusip(String cusip) {
        return tradeRepository.findByCusip(cusip);
    }
    
    public Trade cancelTrade(Long id) {
        Optional<Trade> tradeOpt = tradeRepository.findById(id);
        if (tradeOpt.isPresent()) {
            Trade trade = tradeOpt.get();
            if ("PENDING".equals(trade.getStatus())) {
                trade.setStatus("CANCELLED");
                Trade cancelledTrade = tradeRepository.save(trade);
                
                // Notify WebSocket clients
                webSocketService.broadcastTradeUpdate(cancelledTrade);
                
                return cancelledTrade;
            }
        }
        return null;
    }
}
