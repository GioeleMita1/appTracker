import { Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService } from '../services/finance.service';
import { Transaction, TransactionType, FINANCE_CATEGORIES } from '../models/transaction.model';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.scss'],
})
export class AddTransactionComponent {
  private finance = inject(FinanceService);

  transaction = input<Transaction | null>(null);
  saved = output<void>();
  cancelled = output<void>();

  type = signal<TransactionType>('expense');
  amount = signal('');
  category = signal('');
  date = signal('');
  note = signal('');

  amountError = signal<string | null>(null);
  typeError = signal<string | null>(null);
  dateError = signal<string | null>(null);
  categoryError = signal<string | null>(null);

  readonly categories = [...FINANCE_CATEGORIES];

  constructor() {
    effect(() => {
      const t = this.transaction();
      if (t) {
        this.type.set(t.type);
        this.amount.set(String(t.amount));
        this.category.set(t.category);
        this.date.set(t.date);
        this.note.set(t.note ?? '');
      } else {
        this.type.set('expense');
        this.amount.set('');
        this.category.set('');
        this.note.set('');
        const today = new Date();
        this.date.set(
          `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
        );
      }
    });
  }

  setType(value: TransactionType): void {
    this.type.set(value);
    this.typeError.set(null);
  }

  setAmount(value: string): void {
    this.amount.set(value);
    this.amountError.set(null);
  }

  setCategory(value: string): void {
    this.category.set(value);
    this.categoryError.set(null);
  }

  setDate(value: string): void {
    this.date.set(value);
    this.dateError.set(null);
  }

  setNote(value: string): void {
    this.note.set(value);
  }

  private validate(): boolean {
    let valid = true;
    const amountStr = this.amount().trim();
    const num = amountStr ? parseFloat(amountStr.replace(',', '.')) : NaN;
    if (!amountStr || isNaN(num) || num <= 0) {
      this.amountError.set('Inserisci un importo valido');
      valid = false;
    }
    if (!this.type()) {
      this.typeError.set('Seleziona tipo');
      valid = false;
    }
    if (!this.date().trim()) {
      this.dateError.set('Data obbligatoria');
      valid = false;
    }
    if (!this.category().trim()) {
      this.categoryError.set('Seleziona una categoria');
      valid = false;
    }
    return valid;
  }

  save(): void {
    this.amountError.set(null);
    this.typeError.set(null);
    this.dateError.set(null);
    this.categoryError.set(null);
    if (!this.validate()) return;

    const amountStr = this.amount().trim().replace(',', '.');
    const amount = parseFloat(amountStr);
    const date = this.date().trim();
    const category = this.category().trim();
    const noteVal = this.note().trim() || undefined;

    const t = this.transaction();
    if (t) {
      this.finance.update(t.id, {
        type: this.type(),
        amount,
        category,
        date,
        note: noteVal,
      });
    } else {
      this.finance.add({
        type: this.type(),
        amount,
        category,
        date,
        note: noteVal,
      });
    }
    this.saved.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
