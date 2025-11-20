export interface Transaction {
  date: string;
  entityName: string;
  product: string;
  category: string;
  location: string;
  sales: number;
  cost: number;
  margin: number;
  expenses: number;
  profit: number;
  marginPercent: number;
  profitPercent: number;
}

export interface KPIResult {
  totalSales: number;
  totalCost: number;
  avgMarginPercent: number;
  topLocation: string;
  topProduct: string;
  topCustomer: string;
}

export interface AggregatedData {
  name: string;
  value: number;
  [key: string]: string | number;
}