import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivityService, GymEntry } from '../services/activity.service';

const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  /** Centro della finestra di giorni mostrata (timestamp) */
  weekAnchor = signal(this.getStartOfWeek(Date.now()));
  selectedDate = signal<string | null>(null);
  noteInput = signal('');
  isAdding = signal(false);

  /** Giorni da mostrare nella strip (es. 14 giorni: settimana prima + corrente o simile) */
  dayPills = computed(() => {
    this.activity.entriesVersion();
    const start = this.weekAnchor();
    const pills: { dateStr: string; dayName: string; dayNum: string }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const day = d.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = d.getDay();
      const lunFirst = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      pills.push({
        dateStr,
        dayName: DAY_NAMES[lunFirst],
        dayNum: String(day).padStart(2, '0'),
      });
    }
    return pills;
  });

  totalThisWeek = computed(() => {
    this.activity.entriesVersion();
    const start = new Date(this.weekAnchor());
    const startStr = this.toDateStr(start);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const endStr = this.toDateStr(end);
    let count = 0;
    for (let i = 0; i <= 6; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const str = this.toDateStr(d);
      if (this.activity.hasEntry(str)) count++;
    }
    return count;
  });

  totalThisMonth = computed(() => {
    this.activity.entriesVersion();
    const now = new Date();
    return this.activity.getTotalForMonth(now.getFullYear(), now.getMonth() + 1);
  });

  selectedEntry = computed(() => {
    const d = this.selectedDate();
    if (!d) return null;
    return this.activity.getEntry(d);
  });

  /** Giorno selezionato: se null, usa oggi */
  effectiveSelectedDate = computed(() => {
    const s = this.selectedDate();
    if (s) return s;
    return this.toDateStr(new Date());
  });

  /** Calendario mensile (per la griglia sotto) */
  calendarYear = signal(new Date().getFullYear());
  calendarMonth = signal(new Date().getMonth() + 1);

  calendarMonthLabel = computed(() => {
    const m = this.calendarMonth();
    return `${MONTH_NAMES[m - 1]} ${this.calendarYear()}`;
  });

  calendarGrid = computed(() => {
    this.activity.entriesVersion();
    const year = this.calendarYear();
    const month = this.calendarMonth();
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const startWeekday = (first.getDay() + 6) % 7; // 0 = Lun
    const daysInMonth = last.getDate();
    const cells: { day: number | null; dateStr: string | null }[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ day: null, dateStr: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr });
    }
    return cells;
  });

  readonly dayNames = DAY_NAMES;

  constructor(public activity: ActivityService) {}

  ngOnInit(): void {
    if (!this.selectedDate()) this.selectedDate.set(this.toDateStr(new Date()));
  }

  private getStartOfWeek(t: number): number {
    const d = new Date(t);
    const day = d.getDay();
    const diff = day === 0 ? 6 : day - 1;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  private toDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  isGymDay(dateStr: string): boolean {
    return this.activity.hasEntry(dateStr);
  }

  selectDay(dateStr: string): void {
    this.selectedDate.set(dateStr);
    const entry = this.activity.getEntry(dateStr);
    this.noteInput.set(entry?.note ?? '');
    this.isAdding.set(false);
  }

  openAdd(dateStr: string): void {
    this.selectedDate.set(dateStr);
    this.noteInput.set('');
    this.isAdding.set(true);
  }

  saveEntry(): void {
    const d = this.selectedDate();
    if (!d) return;
    const note = this.noteInput().trim();
    if (this.activity.hasEntry(d)) {
      this.activity.updateEntry(d, note || undefined);
    } else {
      this.activity.addEntry(d, note || undefined);
    }
    this.isAdding.set(false);
    this.selectedDate.set(null);
  }

  deleteEntry(): void {
    const d = this.effectiveSelectedDate();
    if (!d) return;
    if (!confirm('Sei sicuro di voler eliminare questo allenamento?')) return;
    this.activity.removeEntry(d);
    this.isAdding.set(false);
  }

  cancel(): void {
    this.selectedDate.set(null);
    this.isAdding.set(false);
  }

  formatDateDisplay(dateStr: string): string {
    const [y, m, day] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, day);
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  formatShortDate(dateStr: string): string {
    const [y, m, day] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, day);
    return date.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  prevCalendarMonth(): void {
    let y = this.calendarYear();
    let m = this.calendarMonth() - 1;
    if (m < 1) {
      m = 12;
      y--;
    }
    this.calendarMonth.set(m);
    this.calendarYear.set(y);
  }

  nextCalendarMonth(): void {
    let y = this.calendarYear();
    let m = this.calendarMonth() + 1;
    if (m > 12) {
      m = 1;
      y++;
    }
    this.calendarMonth.set(m);
    this.calendarYear.set(y);
  }
}
