package com.maak.treasurydashboard.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI treasuryDashboardOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("US Treasury Dashboard API")
                        .description("Real-time US Treasury on-the-run issues monitoring API with WebSocket support")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("MAAK Treasury Dashboard")
                                .email("support@maak.com")
                                .url("https://github.com/maak/treasury-dashboard"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8086")
                                .description("Development server"),
                        new Server()
                                .url("https://api.treasury-dashboard.com")
                                .description("Production server")
                ));
    }
}
