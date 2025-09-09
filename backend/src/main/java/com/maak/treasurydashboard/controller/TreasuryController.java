package com.maak.treasurydashboard.controller;

import com.maak.treasurydashboard.model.TreasuryBond;
import com.maak.treasurydashboard.service.TreasuryDataService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treasury")
@CrossOrigin(origins = "*")
@Tag(name = "Treasury Bonds", description = "US Treasury on-the-run issues API")
public class TreasuryController {
    
    @Autowired
    private TreasuryDataService treasuryDataService;
    
    @Operation(
        summary = "Get all treasury bonds",
        description = "Retrieves all US Treasury on-the-run issues (2Y, 5Y, 10Y, 30Y) with current market data"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved treasury bonds",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TreasuryBond.class)
            )
        )
    })
    @GetMapping("/bonds")
    public ResponseEntity<List<TreasuryBond>> getAllBonds() {
        List<TreasuryBond> bonds = treasuryDataService.getAllBonds();
        return ResponseEntity.ok(bonds);
    }
    
    @Operation(
        summary = "Get treasury bond by CUSIP",
        description = "Retrieves a specific US Treasury bond by its CUSIP identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved treasury bond",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = TreasuryBond.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "Treasury bond not found"
        )
    })
    @GetMapping("/bonds/{cusip}")
    public ResponseEntity<TreasuryBond> getBondByCusip(
        @Parameter(description = "CUSIP identifier of the treasury bond", example = "912828YK5")
        @PathVariable String cusip) {
        TreasuryBond bond = treasuryDataService.getBondByCusip(cusip);
        if (bond != null) {
            return ResponseEntity.ok(bond);
        }
        return ResponseEntity.notFound().build();
    }
    
    @Operation(
        summary = "Initialize treasury data",
        description = "Initializes the database with sample US Treasury bond data for testing purposes"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Data initialized successfully",
            content = @Content(
                mediaType = "text/plain",
                schema = @Schema(type = "string", example = "Data initialized successfully")
            )
        )
    })
    @PostMapping("/initialize")
    public ResponseEntity<String> initializeData() {
        treasuryDataService.initializeData();
        return ResponseEntity.ok("Data initialized successfully");
    }
}
