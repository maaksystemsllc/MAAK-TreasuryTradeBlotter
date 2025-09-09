package com.maak.treasurydashboard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maak.treasurydashboard.model.TreasuryBond;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebSocketService {
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public void sendMarketUpdate(List<TreasuryBond> bonds) {
        try {
            messagingTemplate.convertAndSend("/topic/market-data", bonds);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public void sendYieldCurveUpdate(List<TreasuryBond> bonds) {
        try {
            messagingTemplate.convertAndSend("/topic/yield-curve", bonds);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
