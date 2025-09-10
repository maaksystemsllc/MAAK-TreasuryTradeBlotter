import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreasuryService } from '../../services/treasury.service';
import { TradeBookingService } from '../../services/trade-booking.service';
import { TreasuryBond } from '../../models/treasury-bond.model';
import { Trade } from '../../models/trade.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trade-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="panel">
      <div class="panel-header">
        TRADE BOOKING
        <div class="booking-controls">
          <button class="reset-btn" (click)="resetForm()" [disabled]="isSubmitting">RESET</button>
          <button class="book-btn" (click)="bookTrade()" [disabled]="tradeForm.invalid || isSubmitting">
            {{ isSubmitting ? 'BOOKING...' : 'BOOK TRADE' }}
          </button>
        </div>
      </div>
      <div class="panel-content">
        <form [formGroup]="tradeForm" class="trade-form">
          <div class="form-row">
            <div class="form-group">
              <label for="cusip">CUSIP</label>
              <select id="cusip" formControlName="cusip" class="form-control">
                <option value="">Select CUSIP</option>
                <option *ngFor="let bond of availableBonds" [value]="bond.cusip">
                  {{ bond.cusip }} - {{ bond.maturity }}
                </option>
              </select>
              <div class="error" *ngIf="tradeForm.get('cusip')?.invalid && tradeForm.get('cusip')?.touched">
                CUSIP is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="side">SIDE</label>
              <select id="side" formControlName="side" class="form-control">
                <option value="">Select Side</option>
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
              </select>
              <div class="error" *ngIf="tradeForm.get('side')?.invalid && tradeForm.get('side')?.touched">
                Side is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="quantity">QUANTITY</label>
              <input id="quantity" type="number" formControlName="quantity" class="form-control" 
                     placeholder="1000000" min="1000" step="1000">
              <div class="error" *ngIf="tradeForm.get('quantity')?.invalid && tradeForm.get('quantity')?.touched">
                Quantity is required (minimum 1,000)
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="price">PRICE</label>
              <input id="price" type="number" formControlName="price" class="form-control" 
                     placeholder="99.75" min="0" step="0.01">
              <div class="error" *ngIf="tradeForm.get('price')?.invalid && tradeForm.get('price')?.touched">
                <span *ngIf="tradeForm.get('price')?.errors?.['required']">Price is required</span>
                <span *ngIf="tradeForm.get('price')?.errors?.['min']">Price must be positive</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="yield">YIELD (%)</label>
              <input id="yield" type="number" formControlName="yield" class="form-control" 
                     placeholder="4.125" min="0" step="0.001">
              <div class="error" *ngIf="tradeForm.get('yield')?.invalid && tradeForm.get('yield')?.touched">
                <span *ngIf="tradeForm.get('yield')?.errors?.['required']">Yield is required</span>
                <span *ngIf="tradeForm.get('yield')?.errors?.['min']">Yield must be positive</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="counterparty">COUNTERPARTY</label>
              <select id="counterparty" formControlName="counterparty" class="form-control">
                <option value="">Select Counterparty</option>
                <option value="JPM">JPMorgan Chase</option>
                <option value="GS">Goldman Sachs</option>
                <option value="MS">Morgan Stanley</option>
                <option value="BAC">Bank of America</option>
                <option value="C">Citigroup</option>
                <option value="WFC">Wells Fargo</option>
                <option value="DB">Deutsche Bank</option>
                <option value="UBS">UBS</option>
              </select>
              <div class="error" *ngIf="tradeForm.get('counterparty')?.invalid && tradeForm.get('counterparty')?.touched">
                Counterparty is required
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="trader">TRADER</label>
              <input id="trader" type="text" formControlName="trader" class="form-control" 
                     placeholder="SMITH.J" maxlength="20">
              <div class="error" *ngIf="tradeForm.get('trader')?.invalid && tradeForm.get('trader')?.touched">
                Trader is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="settlementDate">SETTLEMENT DATE</label>
              <input id="settlementDate" type="date" formControlName="settlementDate" class="form-control">
              <div class="error" *ngIf="tradeForm.get('settlementDate')?.invalid && tradeForm.get('settlementDate')?.touched">
                Settlement date is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="commission">COMMISSION</label>
              <input id="commission" type="number" formControlName="commission" class="form-control" 
                     placeholder="0.00" min="0" step="0.01">
            </div>
          </div>
        </form>
        
        <div class="trade-summary" *ngIf="selectedBond">
          <h4>SELECTED BOND</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="label">CUSIP:</span>
              <span class="value">{{ selectedBond.cusip }}</span>
            </div>
            <div class="summary-item">
              <span class="label">MATURITY:</span>
              <span class="value">{{ selectedBond.maturity }}</span>
            </div>
            <div class="summary-item">
              <span class="label">CURRENT PRICE:</span>
              <span class="value">{{ formatPrice(selectedBond.price) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">CURRENT YIELD:</span>
              <span class="value">{{ formatPercent(selectedBond.yield) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">BID:</span>
              <span class="value">{{ formatPrice(selectedBond.bidPrice) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">ASK:</span>
              <span class="value">{{ formatPrice(selectedBond.askPrice) }}</span>
            </div>
          </div>
        </div>
        
        <div class="status-message" *ngIf="statusMessage" [class]="statusMessageType">
          {{ statusMessage }}
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
    
    .booking-controls {
      display: flex;
      gap: 8px;
    }
    
    .reset-btn, .book-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 4px 12px;
      font-size: 10px;
      cursor: pointer;
      font-family: var(--font-mono);
      font-weight: bold;
    }
    
    .reset-btn:hover {
      background: var(--bg-hover);
    }
    
    .book-btn {
      background: var(--positive-color);
      color: var(--bg-primary);
    }
    
    .book-btn:hover:not(:disabled) {
      background: #00ff00;
    }
    
    .book-btn:disabled {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      cursor: not-allowed;
    }
    
    .trade-form {
      margin-bottom: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    
    .form-group label {
      font-size: 10px;
      font-weight: bold;
      color: var(--text-secondary);
      margin-bottom: 4px;
      font-family: var(--font-mono);
    }
    
    .form-control {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 6px 8px;
      font-size: 11px;
      font-family: var(--font-mono);
      border-radius: 2px;
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--text-accent);
      background: var(--bg-primary);
    }
    
    .form-control:invalid {
      border-color: var(--negative-color);
    }
    
    .error {
      color: var(--negative-color);
      font-size: 9px;
      margin-top: 2px;
      font-family: var(--font-mono);
    }
    
    .trade-summary {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 2px;
    }
    
    .trade-summary h4 {
      margin: 0 0 8px 0;
      font-size: 10px;
      color: var(--text-secondary);
      font-family: var(--font-mono);
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-family: var(--font-mono);
    }
    
    .summary-item .label {
      color: var(--text-secondary);
    }
    
    .summary-item .value {
      color: var(--text-primary);
      font-weight: bold;
    }
    
    .status-message {
      padding: 8px 12px;
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: bold;
      border-radius: 2px;
      text-align: center;
    }
    
    .status-message.success {
      background: rgba(0, 255, 0, 0.1);
      color: var(--positive-color);
      border: 1px solid var(--positive-color);
    }
    
    .status-message.error {
      background: rgba(255, 0, 0, 0.1);
      color: var(--negative-color);
      border: 1px solid var(--negative-color);
    }
    
    .status-message.warning {
      background: rgba(255, 255, 0, 0.1);
      color: var(--text-warning);
      border: 1px solid var(--text-warning);
    }
    
    @media (max-width: 1200px) {
      .form-row {
        flex-direction: column;
      }
      
      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class TradeBookingComponent implements OnInit, OnDestroy {
  tradeForm: FormGroup;
  availableBonds: TreasuryBond[] = [];
  selectedBond: TreasuryBond | null = null;
  isSubmitting = false;
  statusMessage = '';
  statusMessageType = '';
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private treasuryService: TreasuryService,
    private tradeBookingService: TradeBookingService
  ) {
    this.tradeForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadAvailableBonds();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private createForm(): FormGroup {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.fb.group({
      cusip: ['', Validators.required],
      side: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1000)]],
      price: ['', [Validators.required, Validators.min(0)]],
      yield: ['', [Validators.required, Validators.min(0)]],
      counterparty: ['', Validators.required],
      trader: ['', Validators.required],
      settlementDate: [tomorrow.toISOString().split('T')[0], Validators.required],
      commission: [0]
    });
  }

  private loadAvailableBonds(): void {
    this.subscription.add(
      this.treasuryService.getAllBonds().subscribe({
        next: (bonds) => {
          this.availableBonds = bonds;
        },
        error: (error) => {
          console.error('Failed to load bonds:', error);
          this.showStatus('Failed to load available bonds', 'error');
        }
      })
    );
  }

  private setupFormSubscriptions(): void {
    this.subscription.add(
      this.tradeForm.get('cusip')?.valueChanges.subscribe(cusip => {
        if (cusip) {
          this.selectedBond = this.availableBonds.find(bond => bond.cusip === cusip) || null;
          if (this.selectedBond) {
            // Auto-populate price and yield from market data
            this.tradeForm.patchValue({
              price: this.selectedBond.price,
              yield: this.selectedBond.yield
            });
          }
        } else {
          this.selectedBond = null;
        }
      })
    );
  }

  bookTrade(): void {
    if (this.tradeForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.statusMessage = '';

    const formValue = this.tradeForm.value;
    const trade: Omit<Trade, 'id' | 'timestamp' | 'status'> = {
      cusip: formValue.cusip,
      maturity: this.selectedBond?.maturity || '',
      side: formValue.side,
      quantity: formValue.quantity,
      price: formValue.price,
      yield: formValue.yield,
      counterparty: formValue.counterparty,
      trader: formValue.trader,
      settlementDate: new Date(formValue.settlementDate).toISOString(),
      commission: formValue.commission || 0
    };

    this.subscription.add(
      this.tradeBookingService.bookTrade(trade).subscribe({
        next: (bookedTrade: Trade) => {
          this.showStatus(`Trade ${bookedTrade.id} booked successfully`, 'success');
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          console.error('Failed to book trade:', error);
          this.showStatus('Failed to book trade. Please try again.', 'error');
          this.isSubmitting = false;
        }
      })
    );
  }

  resetForm(): void {
    this.tradeForm.reset();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.tradeForm.patchValue({
      settlementDate: tomorrow.toISOString().split('T')[0],
      commission: 0
    });
    this.selectedBond = null;
    this.statusMessage = '';
  }

  private showStatus(message: string, type: string): void {
    this.statusMessage = message;
    this.statusMessageType = type;
    
    // Auto-clear success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.statusMessage = '';
      }, 5000);
    }
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
}
