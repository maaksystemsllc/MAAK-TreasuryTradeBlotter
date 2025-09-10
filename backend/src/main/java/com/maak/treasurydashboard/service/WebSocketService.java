package com.maak.treasurydashboard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.maak.treasurydashboard.model.TreasuryBond;
import com.maak.treasurydashboard.model.Trade;
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
            System.out.println("WebSocket: Sending market update for " + bonds.size() + " bonds");
            messagingTemplate.convertAndSend("/topic/market-data", bonds);
            System.out.println("WebSocket: Market update sent successfully");
        } catch (Exception e) {
            System.err.println("WebSocket: Error sending market update: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void sendYieldCurveUpdate(List<TreasuryBond> bonds) {
        try {
            System.out.println("WebSocket: Sending yield curve update for " + bonds.size() + " bonds");
            messagingTemplate.convertAndSend("/topic/yield-curve", bonds);
            System.out.println("WebSocket: Yield curve update sent successfully");
        } catch (Exception e) {
            System.err.println("WebSocket: Error sending yield curve update: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void broadcastTradeUpdate(Trade trade) {
        try {
            System.out.println("WebSocket: Broadcasting trade update for trade ID: " + trade.getId());
            messagingTemplate.convertAndSend("/topic/trades", trade);
            System.out.println("WebSocket: Trade update sent successfully");
        } catch (Exception e) {
            System.err.println("WebSocket: Error sending trade update: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
