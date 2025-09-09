import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-bar">
      <div class="left-section">
        <span class="status-item">
          <span class="label">MARKET:</span>
          <span class="value positive">OPEN</span>
        </span>
        <span class="status-item">
          <span class="label">TIME:</span>
          <span class="value">{{ currentTime }}</span>
        </span>
        <span class="status-item">
          <span class="label">CONN:</span>
          <span class="value" [class]="connectionStatus">{{ connectionText }}</span>
        </span>
      </div>
      <div class="center-section">
        <span class="ticker">
          US TREASURY ON-THE-RUN DASHBOARD - REAL-TIME MARKET DATA
        </span>
      </div>
      <div class="right-section">
        <span class="status-item">
          <span class="label">10Y:</span>
          <span class="value neutral">{{ tenYearYield }}%</span>
        </span>
        <span class="status-item">
          <span class="label">2Y10Y:</span>
          <span class="value" [class]="spreadClass">{{ yieldSpread }}bp</span>
        </span>
      </div>
    </div>
  `,
  styles: [`
    .status-bar {
      height: 24px;
      background-color: var(--bg-secondary);
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      font-size: 10px;
      padding: 0 8px;
    }
    
    .left-section, .right-section {
      display: flex;
      gap: 16px;
    }
    
    .center-section {
      flex: 1;
      text-align: center;
      overflow: hidden;
    }
    
    .status-item {
      display: flex;
      gap: 4px;
    }
    
    .label {
      color: #888;
    }
    
    .value {
      font-weight: bold;
    }
    
    .ticker {
      color: var(--text-accent);
      font-weight: bold;
      animation: scroll-left 30s linear infinite;
      white-space: nowrap;
    }
    
    @keyframes scroll-left {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
  `]
})
export class StatusBarComponent implements OnInit {
  currentTime: string = '';
  connectionStatus: string = 'positive';
  connectionText: string = 'LIVE';
  tenYearYield: string = '4.450';
  yieldSpread: string = '+125';
  spreadClass: string = 'positive';

  ngOnInit(): void {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
