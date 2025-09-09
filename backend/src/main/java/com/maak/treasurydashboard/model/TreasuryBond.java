package com.maak.treasurydashboard.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "treasury_bonds")
public class TreasuryBond {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String cusip;
    
    @Column(nullable = false)
    private String maturity; // 2Y, 5Y, 10Y, 30Y
    
    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal yield;
    
    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal price;
    
    @Column(nullable = false, precision = 10, scale = 6)
    private BigDecimal coupon;
    
    @Column(name = "price_change", precision = 10, scale = 4)
    private BigDecimal priceChange;
    
    @Column(name = "yield_change", precision = 10, scale = 6)
    private BigDecimal yieldChange;
    
    @Column(name = "bid_price", precision = 10, scale = 4)
    private BigDecimal bidPrice;
    
    @Column(name = "ask_price", precision = 10, scale = 4)
    private BigDecimal askPrice;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @Column(name = "volume")
    private Long volume;
    
    // Constructors
    public TreasuryBond() {}
    
    public TreasuryBond(String cusip, String maturity, BigDecimal yield, BigDecimal price, 
                       BigDecimal coupon, BigDecimal bidPrice, BigDecimal askPrice) {
        this.cusip = cusip;
        this.maturity = maturity;
        this.yield = yield;
        this.price = price;
        this.coupon = coupon;
        this.bidPrice = bidPrice;
        this.askPrice = askPrice;
        this.lastUpdated = LocalDateTime.now();
        this.priceChange = BigDecimal.ZERO;
        this.yieldChange = BigDecimal.ZERO;
        this.volume = 0L;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCusip() { return cusip; }
    public void setCusip(String cusip) { this.cusip = cusip; }
    
    public String getMaturity() { return maturity; }
    public void setMaturity(String maturity) { this.maturity = maturity; }
    
    public BigDecimal getYield() { return yield; }
    public void setYield(BigDecimal yield) { this.yield = yield; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getCoupon() { return coupon; }
    public void setCoupon(BigDecimal coupon) { this.coupon = coupon; }
    
    public BigDecimal getPriceChange() { return priceChange; }
    public void setPriceChange(BigDecimal priceChange) { this.priceChange = priceChange; }
    
    public BigDecimal getYieldChange() { return yieldChange; }
    public void setYieldChange(BigDecimal yieldChange) { this.yieldChange = yieldChange; }
    
    public BigDecimal getBidPrice() { return bidPrice; }
    public void setBidPrice(BigDecimal bidPrice) { this.bidPrice = bidPrice; }
    
    public BigDecimal getAskPrice() { return askPrice; }
    public void setAskPrice(BigDecimal askPrice) { this.askPrice = askPrice; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public Long getVolume() { return volume; }
    public void setVolume(Long volume) { this.volume = volume; }
}
