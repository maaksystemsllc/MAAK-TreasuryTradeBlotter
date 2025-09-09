package com.maak.treasurydashboard.service;

import com.maak.treasurydashboard.model.TreasuryBond;
import com.maak.treasurydashboard.repository.TreasuryBondRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class TreasuryDataService {
    
    @Autowired
    private TreasuryBondRepository repository;
    
    @Autowired
    private WebSocketService webSocketService;
    
    private final Random random = new Random();
    
    public void initializeData() {
        if (repository.count() == 0) {
            // Initialize with on-the-run treasury bonds
            repository.save(new TreasuryBond("912828YK5", "2Y", 
                new BigDecimal("4.875"), new BigDecimal("99.8125"), 
                new BigDecimal("4.875"), new BigDecimal("99.8000"), new BigDecimal("99.8250")));
            
            repository.save(new TreasuryBond("912828YM1", "5Y", 
                new BigDecimal("4.625"), new BigDecimal("98.7500"), 
                new BigDecimal("4.625"), new BigDecimal("98.7375"), new BigDecimal("98.7625")));
            
            repository.save(new TreasuryBond("912828YN9", "10Y", 
                new BigDecimal("4.450"), new BigDecimal("97.2500"), 
                new BigDecimal("4.450"), new BigDecimal("97.2375"), new BigDecimal("97.2625")));
            
            repository.save(new TreasuryBond("912810TM0", "30Y", 
                new BigDecimal("4.625"), new BigDecimal("95.1250"), 
                new BigDecimal("4.625"), new BigDecimal("95.1125"), new BigDecimal("95.1375")));
        }
    }
    
    @Scheduled(fixedRate = 2000) // Update every 2 seconds
    public void updateMarketData() {
        List<TreasuryBond> bonds = repository.findAll();
        
        for (TreasuryBond bond : bonds) {
            // Simulate realistic market movements
            BigDecimal oldPrice = bond.getPrice();
            BigDecimal oldYield = bond.getYield();
            
            // Generate small random changes (±0.05% for price, ±0.02% for yield)
            double priceChangePercent = (random.nextGaussian() * 0.0005);
            double yieldChangePercent = (random.nextGaussian() * 0.0002);
            
            BigDecimal newPrice = oldPrice.multiply(BigDecimal.ONE.add(BigDecimal.valueOf(priceChangePercent)))
                .setScale(4, RoundingMode.HALF_UP);
            BigDecimal newYield = oldYield.multiply(BigDecimal.ONE.add(BigDecimal.valueOf(yieldChangePercent)))
                .setScale(6, RoundingMode.HALF_UP);
            
            // Calculate changes
            BigDecimal priceChange = newPrice.subtract(oldPrice);
            BigDecimal yieldChange = newYield.subtract(oldYield);
            
            // Update bid/ask spread
            BigDecimal spread = new BigDecimal("0.0125"); // 1/8th point spread
            BigDecimal bidPrice = newPrice.subtract(spread.divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP));
            BigDecimal askPrice = newPrice.add(spread.divide(BigDecimal.valueOf(2), 4, RoundingMode.HALF_UP));
            
            // Update volume (simulate trading activity)
            long volumeIncrease = random.nextInt(1000) + 100;
            
            bond.setPrice(newPrice);
            bond.setYield(newYield);
            bond.setPriceChange(priceChange);
            bond.setYieldChange(yieldChange);
            bond.setBidPrice(bidPrice);
            bond.setAskPrice(askPrice);
            bond.setVolume(bond.getVolume() + volumeIncrease);
            bond.setLastUpdated(LocalDateTime.now());
            
            repository.save(bond);
        }
        
        // Send updates via WebSocket
        webSocketService.sendMarketUpdate(bonds);
    }
    
    public List<TreasuryBond> getAllBonds() {
        return repository.findAllOrderByMaturity();
    }
    
    public TreasuryBond getBondByCusip(String cusip) {
        return repository.findByCusip(cusip).orElse(null);
    }
}
