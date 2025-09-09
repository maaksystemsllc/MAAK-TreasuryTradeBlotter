package com.maak.treasurydashboard.config;

import com.maak.treasurydashboard.service.TreasuryDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private TreasuryDataService treasuryDataService;
    
    @Override
    public void run(String... args) throws Exception {
        treasuryDataService.initializeData();
    }
}
