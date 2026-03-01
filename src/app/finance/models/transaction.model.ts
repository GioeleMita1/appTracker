export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const FINANCE_CATEGORIES: readonly string[] = [
  'Cibo',
  'Abbonamenti',
  'Palestra',
  'Investimenti',
  'Altro',
];
