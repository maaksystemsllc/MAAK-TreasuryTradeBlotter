import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TreasuryBond } from '../models/treasury-bond.model';
import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class TreasuryService {
  private apiUrl = 'http://localhost:8086/api/treasury';
  private wsUrl = 'http://localhost:8086/ws';
  private stompClient: Client | null = null;
  private marketDataSubject = new Subject<TreasuryBond[]>();
  
  public marketData$ = this.marketDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeWebSocket();
  }

  getAllBonds(): Observable<TreasuryBond[]> {
    console.log('Treasury Service - Calling API:', `${this.apiUrl}/bonds`);
    return this.http.get<TreasuryBond[]>(`${this.apiUrl}/bonds`);
  }

  getBondByCusip(cusip: string): Observable<TreasuryBond> {
    return this.http.get<TreasuryBond>(`${this.apiUrl}/bonds/${cusip}`);
  }

  initializeData(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/initialize`, {});
  }

  private initializeWebSocket(): void {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.wsUrl),
      debug: (str: string) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame: any) => {
        console.log('Connected: ' + frame);
        
        this.stompClient?.subscribe('/topic/market-data', (message: any) => {
          const bonds: TreasuryBond[] = JSON.parse(message.body);
          this.marketDataSubject.next(bonds);
        });
      },
      onStompError: (error: any) => {
        console.error('WebSocket connection error:', error);
        // Don't retry immediately to avoid console spam
        setTimeout(() => this.initializeWebSocket(), 10000);
      },
      onWebSocketError: (error: any) => {
        console.error('WebSocket error:', error);
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
