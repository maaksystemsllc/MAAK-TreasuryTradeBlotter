import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Trade } from '../models/trade.model';

@Injectable({
  providedIn: 'root'
})
export class TradeBookingService {
  private apiUrl = 'http://localhost:8086/api/treasury';
  private tradeBookedSubject = new Subject<Trade>();
  
  public tradeBooked$ = this.tradeBookedSubject.asObservable();

  constructor(private http: HttpClient) {}

  bookTrade(trade: Omit<Trade, 'id' | 'timestamp' | 'status'>): Observable<Trade> {
    const tradeRequest = {
      ...trade,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };

    return this.http.post<Trade>(`${this.apiUrl}/trades/book`, tradeRequest);
  }

  getAllTrades(): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.apiUrl}/trades`);
  }

  getTradeById(id: string): Observable<Trade> {
    return this.http.get<Trade>(`${this.apiUrl}/trades/${id}`);
  }

  cancelTrade(id: string): Observable<Trade> {
    return this.http.put<Trade>(`${this.apiUrl}/trades/${id}/cancel`, {});
  }

  getTradesByStatus(status: string): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.apiUrl}/trades?status=${status}`);
  }

  getTradesByTrader(trader: string): Observable<Trade[]> {
    return this.http.get<Trade[]>(`${this.apiUrl}/trades?trader=${trader}`);
  }

  // Notify components when a trade is booked
  notifyTradeBooked(trade: Trade): void {
    this.tradeBookedSubject.next(trade);
  }
}
