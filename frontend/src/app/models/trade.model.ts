export interface Trade {
  id: string;
  cusip: string;
  maturity: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  yield: number;
  counterparty: string;
  trader: string;
  timestamp: string;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED' | 'FAILED';
  settlementDate: string;
  commission?: number;
}
