export interface TreasuryBond {
  id: number;
  cusip: string;
  maturity: string;
  yield: number;
  price: number;
  coupon: number;
  priceChange: number;
  yieldChange: number;
  bidPrice: number;
  askPrice: number;
  lastUpdated: string;
  volume: number;
}
