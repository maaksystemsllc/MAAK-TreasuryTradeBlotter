import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasuryService } from '../../services/treasury.service';
import { TreasuryBond } from '../../models/treasury-bond.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-yield-curve',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="panel">
      <div class="panel-header">
        US TREASURY YIELD CURVE
      </div>
      <div class="panel-content">
        <canvas #yieldChart width="400" height="200"></canvas>
        <div class="curve-data">
          <div *ngFor="let point of yieldCurveData" class="data-point">
            <span class="maturity">{{ point.maturity }}</span>
            <span class="yield" [class]="getYieldClass(point.change)">
              {{ formatYield(point.yieldValue) }}
            </span>
            <span class="change" [class]="getYieldClass(point.change)">
              {{ formatChange(point.change) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    canvas {
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-color);
      width: 100%;
      height: 200px;
    }
    
    .curve-data {
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    
    .data-point {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 5px;
      border: 1px solid var(--border-color);
      background-color: var(--bg-secondary);
    }
    
    .maturity {
      font-weight: bold;
      color: var(--text-accent);
      font-size: 11px;
    }
    
    .yield {
      font-size: 14px;
      font-weight: bold;
      margin: 2px 0;
    }
    
    .change {
      font-size: 10px;
    }
  `]
})
export class YieldCurveComponent implements OnInit, OnDestroy {
  @ViewChild('yieldChart', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  yieldCurveData: any[] = [];
  private subscription: Subscription = new Subscription();
  private ctx: CanvasRenderingContext2D | null = null;

  constructor(private treasuryService: TreasuryService) {}

  ngOnInit(): void {
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    // Load initial data
    this.subscription.add(
      this.treasuryService.getAllBonds().subscribe(bonds => {
        this.updateYieldCurve(bonds);
      })
    );

    // Subscribe to real-time updates
    this.subscription.add(
      this.treasuryService.marketData$.subscribe(bonds => {
        this.updateYieldCurve(bonds);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateYieldCurve(bonds: TreasuryBond[]): void {
    this.yieldCurveData = bonds.map(bond => ({
      maturity: bond.maturity,
      yieldValue: bond.yield,
      change: bond.yieldChange,
      maturityOrder: this.getMaturityOrder(bond.maturity)
    })).sort((a, b) => a.maturityOrder - b.maturityOrder);

    this.drawChart();
  }

  private getMaturityOrder(maturity: string): number {
    const order: { [key: string]: number } = {
      '2Y': 2,
      '5Y': 5,
      '10Y': 10,
      '30Y': 30
    };
    return order[maturity] || 0;
  }

  private drawChart(): void {
    if (!this.ctx || this.yieldCurveData.length === 0) return;

    const canvas = this.chartCanvas.nativeElement;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    this.ctx!.fillStyle = '#1a1a1a';
    this.ctx!.fillRect(0, 0, width, height);

    // Set up chart dimensions
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Find min/max yields for scaling
    const yields = this.yieldCurveData.map(d => d.yieldValue);
    const minYield = Math.min(...yields) - 0.1;
    const maxYield = Math.max(...yields) + 0.1;

    // Draw grid lines
    this.ctx!.strokeStyle = '#333333';
    this.ctx!.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      this.ctx!.beginPath();
      this.ctx!.moveTo(padding, y);
      this.ctx!.lineTo(width - padding, y);
      this.ctx!.stroke();
    }

    // Vertical grid lines
    for (let i = 0; i < this.yieldCurveData.length; i++) {
      const x = padding + (i / (this.yieldCurveData.length - 1)) * chartWidth;
      this.ctx!.beginPath();
      this.ctx!.moveTo(x, padding);
      this.ctx!.lineTo(x, height - padding);
      this.ctx!.stroke();
    }

    // Draw yield curve
    this.ctx!.strokeStyle = '#00ff00';
    this.ctx!.lineWidth = 2;
    this.ctx!.beginPath();

    this.yieldCurveData.forEach((point, index) => {
      const x = padding + (index / (this.yieldCurveData.length - 1)) * chartWidth;
      const y = height - padding - ((point.yieldValue - minYield) / (maxYield - minYield)) * chartHeight;

      if (index === 0) {
        this.ctx!.moveTo(x, y);
      } else {
        this.ctx!.lineTo(x, y);
      }

      // Draw data points
      this.ctx!.fillStyle = point.change >= 0 ? '#ff0000' : '#00ff00';
      this.ctx!.beginPath();
      this.ctx!.arc(x, y, 4, 0, 2 * Math.PI);
      this.ctx!.fill();
    });

    this.ctx!.stroke();

    // Draw labels
    this.ctx!.fillStyle = '#ffffff';
    this.ctx!.font = '10px Roboto Mono';
    this.ctx!.textAlign = 'center';

    // X-axis labels (maturities)
    this.yieldCurveData.forEach((point, index) => {
      const x = padding + (index / (this.yieldCurveData.length - 1)) * chartWidth;
      this.ctx!.fillText(point.maturity, x, height - 10);
    });

    // Y-axis labels (yields)
    this.ctx!.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * chartHeight;
      const yieldValue = maxYield - (i / 5) * (maxYield - minYield);
      this.ctx!.fillText(yieldValue.toFixed(2) + '%', padding - 10, y + 3);
    }
  }

  formatYield(yieldValue: number): string {
    return `${yieldValue.toFixed(3)}%`;
  }

  formatChange(change: number): string {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${(change * 100).toFixed(1)}bp`;
  }

  getYieldClass(change: number): string {
    if (change > 0) return 'negative';
    if (change < 0) return 'positive';
    return 'neutral';
  }
}
