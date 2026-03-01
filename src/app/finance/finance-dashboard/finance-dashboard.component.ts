import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService } from '../services/finance.service';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finance-dashboard.component.html',
  styleUrls: ['./finance-dashboard.component.scss'],
})
export class FinanceDashboardComponent {
  private finance = inject(FinanceService);

  private now = new Date();
  private year = this.now.getFullYear();
  private month = this.now.getMonth() + 1;

  monthly = computed(() => {
    this.finance.version();
    return this.finance.getMonthlyTotals(this.year, this.month);
  });

  totalBalance = computed(() => {
    this.finance.version();
    return this.finance.getTotalBalance();
  });

  income(): number {
    return this.monthly().income;
  }

  expense(): number {
    return this.monthly().expense;
  }

  net(): number {
    return this.monthly().income - this.monthly().expense;
  }

  count(): number {
    return this.monthly().count;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
