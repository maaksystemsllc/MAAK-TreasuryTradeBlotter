package com.maak.treasurydashboard.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "trades")
public class Trade {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String cusip;
    
    @Column(nullable = false)
    private String maturity;
    
    @Column(nullable = false)
    private String side; // BUY or SELL
    
    @Column(nullable = false)
    private Long quantity;
    
    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal price;
    
    @Column(nullable = false, precision = 8, scale = 5)
    private BigDecimal yield;
    
    @Column(nullable = false)
    private String counterparty;
    
    @Column(nullable = false)
    private String trader;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private String status; // PENDING, EXECUTED, CANCELLED
    
    @Column(nullable = false)
    private LocalDateTime settlementDate;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal commission;
    
    // Default constructor
    public Trade() {}
    
    // Constructor
    public Trade(String cusip, String maturity, String side, Long quantity, 
                 BigDecimal price, BigDecimal yield, String counterparty, 
                 String trader, LocalDateTime timestamp, String status, 
                 LocalDateTime settlementDate, BigDecimal commission) {
        this.cusip = cusip;
        this.maturity = maturity;
        this.side = side;
        this.quantity = quantity;
        this.price = price;
        this.yield = yield;
        this.counterparty = counterparty;
        this.trader = trader;
        this.timestamp = timestamp;
        this.status = status;
        this.settlementDate = settlementDate;
        this.commission = commission;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCusip() {
        return cusip;
    }
    
    public void setCusip(String cusip) {
        this.cusip = cusip;
    }
    
    public String getMaturity() {
        return maturity;
    }
    
    public void setMaturity(String maturity) {
        this.maturity = maturity;
    }
    
    public String getSide() {
        return side;
    }
    
    public void setSide(String side) {
        this.side = side;
    }
    
    public Long getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public BigDecimal getYield() {
        return yield;
    }
    
    public void setYield(BigDecimal yield) {
        this.yield = yield;
    }
    
    public String getCounterparty() {
        return counterparty;
    }
    
    public void setCounterparty(String counterparty) {
        this.counterparty = counterparty;
    }
    
    public String getTrader() {
        return trader;
    }
    
    public void setTrader(String trader) {
        this.trader = trader;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getSettlementDate() {
        return settlementDate;
    }
    
    public void setSettlementDate(LocalDateTime settlementDate) {
        this.settlementDate = settlementDate;
    }
    
    public BigDecimal getCommission() {
        return commission;
    }
    
    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }
}
