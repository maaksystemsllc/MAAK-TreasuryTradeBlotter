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
        console.log('WebSocket Connected: ' + frame);
        console.log('Subscribing to /topic/market-data');
        
        this.stompClient?.subscribe('/topic/market-data', (message: any) => {
          console.log('WebSocket: Received market data message:', message);
          try {
            const bonds: TreasuryBond[] = JSON.parse(message.body);
            console.log('WebSocket: Parsed bonds data:', bonds);
            this.marketDataSubject.next(bonds);
          } catch (error) {
            console.error('WebSocket: Error parsing message:', error);
          }
        });

        // Also subscribe to yield curve updates (same data, different topic)
        this.stompClient?.subscribe('/topic/yield-curve', (message: any) => {
          console.log('WebSocket: Received yield curve message:', message);
          try {
            const bonds: TreasuryBond[] = JSON.parse(message.body);
            console.log('WebSocket: Parsed yield curve data:', bonds);
            this.marketDataSubject.next(bonds);
          } catch (error) {
            console.error('WebSocket: Error parsing yield curve message:', error);
          }
        });
        
        console.log('WebSocket subscription established');
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
