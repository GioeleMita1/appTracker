import { Injectable, signal } from '@angular/core';
import { Transaction, TransactionType } from '../models/transaction.model';

const STORAGE_KEY = 'ph_finance_transactions';

@Injectable({ providedIn: 'root' })
export class FinanceService {
  private transactions: Transaction[] = [];
  readonly version = signal(0);

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.transactions = JSON.parse(raw);
      else this.transactions = [];
    } catch {
      this.transactions = [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.transactions));
    this.version.update((v) => v + 1);
  }

  getAll(): Transaction[] {
    return [...this.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  getById(id: string): Transaction | undefined {
    return this.transactions.find((t) => t.id === id);
  }

  getForMonth(year: number, month: number): Transaction[] {
    return this.transactions.filter((t) => {
      const [y, m] = t.date.split('-').map(Number);
      return y === year && m === month;
    });
  }

  getMonthlyTotals(year: number, month: number): {
    income: number;
    expense: number;
    count: number;
  } {
    const list = this.getForMonth(year, month);
    let income = 0;
    let expense = 0;
    for (const t of list) {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    }
    return { income, expense, count: list.length };
  }

  getTotalBalance(): number {
    let balance = 0;
    for (const t of this.transactions) {
      if (t.type === 'income') balance += t.amount;
      else balance -= t.amount;
    }
    return balance;
  }

  add(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const now = new Date().toISOString();
    const id = `fin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const entry: Transaction = {
      ...transaction,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.transactions.push(entry);
    this.save();
    return entry;
  }

  update(
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>
  ): Transaction | undefined {
    const entry = this.transactions.find((t) => t.id === id);
    if (!entry) return undefined;
    if (data.type !== undefined) entry.type = data.type;
    if (data.amount !== undefined) entry.amount = data.amount;
    if (data.category !== undefined) entry.category = data.category;
    if (data.date !== undefined) entry.date = data.date;
    if (data.note !== undefined) entry.note = data.note;
    entry.updatedAt = new Date().toISOString();
    this.save();
    return entry;
  }

  remove(id: string): boolean {
    const idx = this.transactions.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.transactions.splice(idx, 1);
    this.save();
    return true;
  }
}
