import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TreasuryBond } from '../models/treasury-bond.model';
import * as SockJS from 'sockjs-client';
import { Stomp, CompatClient } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class TreasuryService {
  private apiUrl = 'http://localhost:8085/api/treasury';
  private wsUrl = 'http://localhost:8085/ws';
  private stompClient: CompatClient | null = null;
  private marketDataSubject = new Subject<TreasuryBond[]>();
  
  public marketData$ = this.marketDataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeWebSocket();
  }

  getAllBonds(): Observable<TreasuryBond[]> {
    return this.http.get<TreasuryBond[]>(`${this.apiUrl}/bonds`);
  }

  getBondByCusip(cusip: string): Observable<TreasuryBond> {
    return this.http.get<TreasuryBond>(`${this.apiUrl}/bonds/${cusip}`);
  }

  initializeData(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/initialize`, {});
  }

  private initializeWebSocket(): void {
    const socket = new SockJS(this.wsUrl);
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.configure({
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    this.stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      
      this.stompClient?.subscribe('/topic/market-data', (message) => {
        const bonds: TreasuryBond[] = JSON.parse(message.body);
        this.marketDataSubject.next(bonds);
      });
    }, (error) => {
      console.error('WebSocket connection error:', error);
      setTimeout(() => this.initializeWebSocket(), 5000);
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}
