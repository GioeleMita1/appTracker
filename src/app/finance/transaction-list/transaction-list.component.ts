import { Component, computed, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../services/finance.service';
import { Transaction } from '../models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss'],
})
export class TransactionListComponent {
  private finance = inject(FinanceService);

  removingId = signal<string | null>(null);
  editTransaction = output<Transaction>();
  transactions = computed(() => {
    this.finance.version();
    return this.finance.getAll();
  });

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  onEdit(t: Transaction): void {
    this.editTransaction.emit(t);
  }

  onDelete(t: Transaction): void {
    if (!confirm('Eliminare questo movimento? L\'operazione non può essere annullata.')) return;
    this.removingId.set(t.id);
    setTimeout(() => {
      if (this.removingId() === t.id) {
        this.finance.remove(t.id);
        this.removingId.set(null);
      }
    }, 280);
  }
}
