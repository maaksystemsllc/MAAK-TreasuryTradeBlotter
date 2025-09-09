import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketGridComponent } from './components/market-grid/market-grid.component';
import { YieldCurveComponent } from './components/yield-curve/yield-curve.component';
import { StatusBarComponent } from './components/status-bar/status-bar.component';
import { TradeBlotterComponent } from './components/trade-blotter/trade-blotter.component';
import { TreasuryService } from './services/treasury.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MarketGridComponent, YieldCurveComponent, StatusBarComponent, TradeBlotterComponent],
  template: `
    <div class="dashboard">
      <header class="header">
        <div class="header-left">
          <span class="logo">MAAK</span>
          <span class="title">US TREASURY DASHBOARD</span>
        </div>
        <div class="header-right">
          <span class="market-status">MARKET OPEN</span>
          <span class="timestamp">{{ currentTime }}</span>
        </div>
      </header>
      
      <main class="main-content">
        <div class="grid-container">
          <div class="market-section">
            <app-market-grid></app-market-grid>
          </div>
          <div class="chart-section">
            <app-yield-curve></app-yield-curve>
          </div>
          <div class="blotter-section">
            <app-trade-blotter></app-trade-blotter>
          </div>
        </div>
      </main>
      
      <app-status-bar></app-status-bar>
    </div>
  `,
  styles: [`
    .dashboard {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-primary);
    }
    
    .header {
      height: 32px;
      background-color: var(--header-bg);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .logo {
      font-weight: bold;
      font-size: 14px;
      background-color: var(--text-secondary);
      color: var(--bg-primary);
      padding: 2px 8px;
      border-radius: 2px;
    }
    
    .title {
      font-weight: bold;
      font-size: 12px;
      letter-spacing: 1px;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 11px;
    }
    
    .market-status {
      color: var(--positive);
      font-weight: bold;
    }
    
    .timestamp {
      font-family: monospace;
    }
    
    .main-content {
      flex: 1;
      overflow: hidden;
      padding: 4px;
    }
    
    .grid-container {
      height: 100%;
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 300px;
      gap: 4px;
    }
    
    .market-section {
      overflow: hidden;
    }
    
    .chart-section {
      overflow: hidden;
    }
    
    .blotter-section {
      grid-column: 1 / -1;
      overflow: hidden;
    }
    
    @media (max-width: 1200px) {
      .grid-container {
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 300px 250px;
      }
      
      .blotter-section {
        grid-column: 1;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentTime: string = '';

  constructor(private treasuryService: TreasuryService) {}

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
    
    // Initialize data on startup
    this.treasuryService.initializeData().subscribe({
      next: (response) => console.log('Data initialized:', response),
      error: (error) => console.error('Failed to initialize data:', error)
    });
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }
}
