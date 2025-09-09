import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trade } from '../../models/trade.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trade-blotter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <div class="panel-header">
        TRADE BLOTTER
        <div class="blotter-controls">
          <span class="trade-count">{{ trades.length }} TRADES</span>
          <button class="clear-btn" (click)="clearTrades()">CLEAR</button>
        </div>
      </div>
      <div class="panel-content">
        <div class="blotter-table-container">
          <table class="blotter-table">
            <thead>
              <tr>
                <th>TIME</th>
                <th>CUSIP</th>
                <th>MATURITY</th>
                <th>SIDE</th>
                <th>QTY</th>
                <th>PRICE</th>
                <th>YIELD</th>
                <th>COUNTERPARTY</th>
                <th>TRADER</th>
                <th>STATUS</th>
                <th>SETTLE</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trade of trades; trackBy: trackByTrade" 
                  [class]="getTradeRowClass(trade)"
                  [class.blink]="isNewTrade(trade.id)">
                <td class="time">{{ formatTime(trade.timestamp) }}</td>
                <td class="cusip">{{ trade.cusip }}</td>
                <td class="maturity">{{ trade.maturity }}</td>
                <td class="side" [class]="getSideClass(trade.side)">{{ trade.side }}</td>
                <td class="quantity">{{ formatQuantity(trade.quantity) }}</td>
                <td class="price">{{ formatPrice(trade.price) }}</td>
                <td class="yield">{{ formatPercent(trade.yield) }}</td>
                <td class="counterparty">{{ trade.counterparty }}</td>
                <td class="trader">{{ trade.trader }}</td>
                <td class="status" [class]="getStatusClass(trade.status)">{{ trade.status }}</td>
                <td class="settle">{{ formatSettleDate(trade.settlementDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .blotter-controls {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .trade-count {
      font-size: 10px;
      color: var(--text-secondary);
    }
    
    .clear-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 2px 8px;
      font-size: 10px;
      cursor: pointer;
      font-family: var(--font-mono);
    }
    
    .clear-btn:hover {
      background: var(--bg-hover);
    }
    
    .blotter-table-container {
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid var(--border-color);
    }
    
    .blotter-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      font-family: var(--font-mono);
    }
    
    .blotter-table th {
      background: var(--bg-secondary);
      padding: 4px 6px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 1;
    }
    
    .blotter-table td {
      padding: 2px 6px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .blotter-table tr:hover {
      background: var(--bg-hover);
    }
    
    .time {
      color: #888;
      width: 60px;
    }
    
    .cusip {
      font-weight: bold;
      width: 80px;
    }
    
    .maturity {
      width: 60px;
    }
    
    .side {
      font-weight: bold;
      text-align: center;
      width: 40px;
    }
    
    .side.buy {
      color: var(--positive-color);
    }
    
    .side.sell {
      color: var(--negative-color);
    }
    
    .quantity {
      text-align: right;
      width: 80px;
    }
    
    .price {
      text-align: right;
      font-weight: bold;
      width: 70px;
    }
    
    .yield {
      text-align: right;
      color: var(--text-secondary);
      width: 60px;
    }
    
    .counterparty {
      width: 100px;
    }
    
    .trader {
      width: 80px;
      color: var(--text-accent);
    }
    
    .status {
      text-align: center;
      font-weight: bold;
      width: 70px;
    }
    
    .status.executed {
      color: var(--positive-color);
    }
    
    .status.pending {
      color: var(--text-warning);
    }
    
    .status.cancelled, .status.failed {
      color: var(--negative-color);
    }
    
    .settle {
      width: 70px;
      font-size: 9px;
    }
    
    .trade-executed {
      background: rgba(0, 255, 0, 0.05);
    }
    
    .trade-cancelled {
      background: rgba(255, 0, 0, 0.05);
      opacity: 0.7;
    }
    
    .trade-failed {
      background: rgba(255, 0, 0, 0.1);
    }
    
    .blink {
      animation: blink 0.5s ease-in-out;
    }
    
    @keyframes blink {
      0%, 100% { background-color: transparent; }
      50% { background-color: var(--text-accent); }
    }
  `]
})
export class TradeBlotterComponent implements OnInit, OnDestroy {
  trades: Trade[] = [];
  private subscription: Subscription = new Subscription();
  private newTradeIds = new Set<string>();

  constructor() {}

  ngOnInit(): void {
    // Generate some sample trades for demonstration
    this.generateSampleTrades();
    
    // Simulate new trades coming in
    this.simulateTradeFlow();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private generateSampleTrades(): void {
    const sampleTrades: Trade[] = [
      {
        id: '1',
        cusip: '912810TM0',
        maturity: '2Y',
        side: 'BUY',
        quantity: 5000000,
        price: 99.75,
        yield: 4.125,
        counterparty: 'JPM',
        trader: 'SMITH.J',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'EXECUTED',
        settlementDate: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: '2',
        cusip: '912810TN8',
        maturity: '5Y',
        side: 'SELL',
        quantity: 10000000,
        price: 98.25,
        yield: 4.250,
        counterparty: 'GS',
        trader: 'JONES.M',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        status: 'EXECUTED',
        settlementDate: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: '3',
        cusip: '912810TP3',
        maturity: '10Y',
        side: 'BUY',
        quantity: 25000000,
        price: 96.50,
        yield: 4.375,
        counterparty: 'MS',
        trader: 'BROWN.K',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        status: 'PENDING',
        settlementDate: new Date(Date.now() + 86400000).toISOString()
      }
    ];
    
    this.trades = sampleTrades.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  private simulateTradeFlow(): void {
    // Simulate new trades every 10-30 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new trade
        this.addNewTrade();
      }
    }, 15000);

    this.subscription.add(() => clearInterval(interval));
  }

  private addNewTrade(): void {
    const cusips = ['912810TM0', '912810TN8', '912810TP3', '912810TQ1'];
    const maturities = ['2Y', '5Y', '10Y', '30Y'];
    const counterparties = ['JPM', 'GS', 'MS', 'BAC', 'C', 'WFC'];
    const traders = ['SMITH.J', 'JONES.M', 'BROWN.K', 'DAVIS.L', 'WILSON.R'];
    const sides: ('BUY' | 'SELL')[] = ['BUY', 'SELL'];
    const statuses: ('EXECUTED' | 'PENDING' | 'CANCELLED')[] = ['EXECUTED', 'PENDING'];

    const newTrade: Trade = {
      id: Date.now().toString(),
      cusip: cusips[Math.floor(Math.random() * cusips.length)],
      maturity: maturities[Math.floor(Math.random() * maturities.length)],
      side: sides[Math.floor(Math.random() * sides.length)],
      quantity: (Math.floor(Math.random() * 50) + 5) * 1000000,
      price: 95 + Math.random() * 10,
      yield: 3.5 + Math.random() * 2,
      counterparty: counterparties[Math.floor(Math.random() * counterparties.length)],
      trader: traders[Math.floor(Math.random() * traders.length)],
      timestamp: new Date().toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      settlementDate: new Date(Date.now() + 86400000).toISOString()
    };

    this.trades.unshift(newTrade);
    this.newTradeIds.add(newTrade.id);

    // Remove blink effect after animation
    setTimeout(() => {
      this.newTradeIds.delete(newTrade.id);
    }, 500);

    // Keep only last 50 trades
    if (this.trades.length > 50) {
      this.trades = this.trades.slice(0, 50);
    }
  }

  trackByTrade(index: number, trade: Trade): string {
    return trade.id;
  }

  isNewTrade(tradeId: string): boolean {
    return this.newTradeIds.has(tradeId);
  }

  formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }

  formatQuantity(quantity: number): string {
    if (quantity >= 1000000) {
      return `${(quantity / 1000000).toFixed(1)}M`;
    } else if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(0)}K`;
    }
    return quantity.toString();
  }

  formatPrice(price: number): string {
    const wholePart = Math.floor(price);
    const fractionalPart = price - wholePart;
    const thirtySeconds = Math.round(fractionalPart * 32);
    return `${wholePart}-${thirtySeconds.toString().padStart(2, '0')}`;
  }

  formatPercent(value: number): string {
    return `${value.toFixed(3)}%`;
  }

  formatSettleDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit' 
    });
  }

  getSideClass(side: string): string {
    return side.toLowerCase();
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getTradeRowClass(trade: Trade): string {
    switch (trade.status) {
      case 'EXECUTED':
        return 'trade-executed';
      case 'CANCELLED':
        return 'trade-cancelled';
      case 'FAILED':
        return 'trade-failed';
      default:
        return '';
    }
  }

  clearTrades(): void {
    this.trades = [];
  }
}
