import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDashboardComponent } from './finance-dashboard/finance-dashboard.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { Transaction } from './models/transaction.model';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [
    CommonModule,
    FinanceDashboardComponent,
    AddTransactionComponent,
    TransactionListComponent,
  ],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent {
  showForm = signal(false);
  editingTransaction = signal<Transaction | null>(null);

  openAdd(): void {
    this.editingTransaction.set(null);
    this.showForm.set(true);
  }

  openEdit(t: Transaction): void {
    this.editingTransaction.set(t);
    this.showForm.set(true);
  }

  onSaved(): void {
    this.showForm.set(false);
    this.editingTransaction.set(null);
  }

  onCancelled(): void {
    this.showForm.set(false);
    this.editingTransaction.set(null);
  }
}
