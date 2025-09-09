import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasuryService } from '../../services/treasury.service';
import { TreasuryBond } from '../../models/treasury-bond.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-market-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <div class="panel-header">
        US TREASURY ON-THE-RUN ISSUES
      </div>
      <div class="panel-content">
        <table class="data-grid">
          <thead>
            <tr>
              <th>MATURITY</th>
              <th>CUSIP</th>
              <th>COUPON</th>
              <th>BID</th>
              <th>ASK</th>
              <th>LAST</th>
              <th>CHG</th>
              <th>YIELD</th>
              <th>YLD CHG</th>
              <th>VOLUME</th>
              <th>TIME</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let bond of bonds; trackBy: trackByBond" 
                [class.blink]="isUpdated(bond.cusip)">
              <td class="maturity">{{ bond.maturity }}</td>
              <td class="cusip">{{ bond.cusip }}</td>
              <td class="coupon">{{ formatPercent(bond.coupon) }}</td>
              <td class="bid">{{ formatPrice(bond.bidPrice) }}</td>
              <td class="ask">{{ formatPrice(bond.askPrice) }}</td>
              <td class="price">{{ formatPrice(bond.price) }}</td>
              <td [class]="getPriceChangeClass(bond.priceChange)">
                {{ formatPriceChange(bond.priceChange) }}
              </td>
              <td class="yield">{{ formatPercent(bond.yield) }}</td>
              <td [class]="getYieldChangeClass(bond.yieldChange)">
                {{ formatYieldChange(bond.yieldChange) }}
              </td>
              <td class="volume">{{ formatVolume(bond.volume) }}</td>
              <td class="time">{{ formatTime(bond.lastUpdated) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .maturity {
      font-weight: bold;
      color: var(--text-accent);
    }
    
    .cusip {
      font-family: monospace;
      font-size: 10px;
    }
    
    .price, .bid, .ask {
      text-align: right;
      font-weight: bold;
    }
    
    .yield {
      text-align: right;
      color: var(--text-secondary);
    }
    
    .volume {
      text-align: right;
      color: var(--text-primary);
    }
    
    .time {
      font-size: 10px;
      color: #888;
    }
  `]
})
export class MarketGridComponent implements OnInit, OnDestroy {
  bonds: TreasuryBond[] = [];
  private subscription: Subscription = new Subscription();
  private updatedBonds = new Set<string>();

  constructor(private treasuryService: TreasuryService) {}

  ngOnInit(): void {
    // Load initial data
    this.subscription.add(
      this.treasuryService.getAllBonds().subscribe({
        next: (bonds) => {
          console.log('Market Grid - Received bonds:', bonds);
          this.bonds = bonds;
        },
        error: (error) => {
          console.error('Market Grid - Error loading bonds:', error);
        }
      })
    );

    // Subscribe to real-time updates
    this.subscription.add(
      this.treasuryService.marketData$.subscribe({
        next: (bonds) => {
          console.log('Market Grid - WebSocket update:', bonds);
          this.updateBonds(bonds);
        },
        error: (error) => {
          console.error('Market Grid - WebSocket error:', error);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateBonds(newBonds: TreasuryBond[]): void {
    newBonds.forEach((newBond: TreasuryBond) => {
      const existingIndex = this.bonds.findIndex(b => b.cusip === newBond.cusip);
      if (existingIndex >= 0) {
        this.bonds[existingIndex] = newBond;
        this.updatedBonds.add(newBond.cusip);
        
        // Remove blink effect after animation
        setTimeout(() => {
          this.updatedBonds.delete(newBond.cusip);
        }, 500);
      }
    });
  }

  trackByBond(index: number, bond: TreasuryBond): string {
    return bond.cusip;
  }

  isUpdated(cusip: string): boolean {
    return this.updatedBonds.has(cusip);
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

  formatPriceChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    const wholePart = Math.floor(Math.abs(change));
    const fractionalPart = Math.abs(change) - wholePart;
    const thirtySeconds = Math.round(fractionalPart * 32);
    return `${sign}${change >= 0 ? '' : '-'}${wholePart}-${thirtySeconds.toString().padStart(2, '0')}`;
  }

  formatYieldChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${(change * 100).toFixed(1)}bp`;
  }

  formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(0)}K`;
    }
    return volume.toString();
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

  getPriceChangeClass(change: number): string {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  }

  getYieldChangeClass(change: number): string {
    if (change > 0) return 'negative'; // Higher yield is negative for bond prices
    if (change < 0) return 'positive'; // Lower yield is positive for bond prices
    return 'neutral';
  }
}
