package com.maak.treasurydashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TreasuryDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(TreasuryDashboardApplication.class, args);
    }
}
