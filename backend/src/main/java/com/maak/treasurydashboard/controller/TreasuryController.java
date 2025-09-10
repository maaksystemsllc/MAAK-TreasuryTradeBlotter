package com.maak.treasurydashboard.controller;

import com.maak.treasurydashboard.model.TreasuryBond;
import com.maak.treasurydashboard.model.Trade;
import com.maak.treasurydashboard.service.TreasuryDataService;
import com.maak.treasurydashboard.service.TradeService;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/treasury")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "true")
@Tag(name = "Treasury Bonds", description = "US Treasury on-the-run issues API")
public class TreasuryController {
    
    @Autowired
    private TreasuryDataService treasuryDataService;
    
    @Autowired
    private TradeService tradeService;
    
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
    
    // Trade booking endpoints
    @Operation(
        summary = "Book a new trade",
        description = "Books a new treasury trade and returns the booked trade with ID and status"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Trade booked successfully",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = Trade.class)
            )
        ),
        @ApiResponse(
            responseCode = "400",
            description = "Invalid trade data"
        )
    })
    @PostMapping("/trades/book")
    public ResponseEntity<Trade> bookTrade(@RequestBody Trade trade) {
        try {
            Trade bookedTrade = tradeService.bookTrade(trade);
            return ResponseEntity.ok(bookedTrade);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @Operation(
        summary = "Get all trades",
        description = "Retrieves all trades ordered by timestamp (most recent first)"
    )
    @GetMapping("/trades")
    public ResponseEntity<List<Trade>> getAllTrades(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String trader) {
        
        List<Trade> trades;
        if (status != null && !status.isEmpty()) {
            trades = tradeService.getTradesByStatus(status);
        } else if (trader != null && !trader.isEmpty()) {
            trades = tradeService.getTradesByTrader(trader);
        } else {
            trades = tradeService.getAllTrades();
        }
        return ResponseEntity.ok(trades);
    }
    
    @Operation(
        summary = "Get trade by ID",
        description = "Retrieves a specific trade by its ID"
    )
    @GetMapping("/trades/{id}")
    public ResponseEntity<Trade> getTradeById(@PathVariable Long id) {
        Optional<Trade> trade = tradeService.getTradeById(id);
        return trade.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @Operation(
        summary = "Cancel a trade",
        description = "Cancels a pending trade by setting its status to CANCELLED"
    )
    @PutMapping("/trades/{id}/cancel")
    public ResponseEntity<Trade> cancelTrade(@PathVariable Long id) {
        Trade cancelledTrade = tradeService.cancelTrade(id);
        if (cancelledTrade != null) {
            return ResponseEntity.ok(cancelledTrade);
        }
        return ResponseEntity.notFound().build();
    }
}
