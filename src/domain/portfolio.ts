export interface PortfolioPosition {
  id: string;
  symbol: string;
  quantity: number;
  averageCost: number;
  currency: string;
  createdAt: string;
}

export interface PortfolioActionState {
  ok: boolean;
  message: string;
}
