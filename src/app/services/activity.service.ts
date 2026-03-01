import { Injectable, signal } from '@angular/core';

export interface GymEntry {
  id: string;
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}

const STORAGE_KEY = 'ph_activity';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private entries: Map<string, GymEntry> = new Map();
  /** Aggiornato a ogni salvataggio su localStorage, per far ri-renderizzare contatore e calendario */
  entriesVersion = signal(0);

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr: GymEntry[] = JSON.parse(raw);
        this.entries = new Map(arr.map((e) => [e.date, e]));
      }
    } catch {
      this.entries = new Map();
    }
  }

  private save(): void {
    const arr = Array.from(this.entries.values());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    this.entriesVersion.update((v) => v + 1);
  }

  getEntriesForMonth(year: number, month: number): GymEntry[] {
    const prefix = `${year}-${String(month).padStart(2, '0')}-`;
    return Array.from(this.entries.values()).filter((e) => e.date.startsWith(prefix));
  }

  getEntry(date: string): GymEntry | undefined {
    return this.entries.get(date);
  }

  hasEntry(date: string): boolean {
    return this.entries.has(date);
  }

  addEntry(date: string, note?: string): GymEntry {
    const id = `gym_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const entry: GymEntry = {
      id,
      date,
      note: note?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    this.entries.set(date, entry);
    this.save();
    return entry;
  }

  updateEntry(date: string, note?: string): GymEntry | undefined {
    const existing = this.entries.get(date);
    if (!existing) return undefined;
    const updated: GymEntry = { ...existing, note: note?.trim() || undefined };
    this.entries.set(date, updated);
    this.save();
    return updated;
  }

  removeEntry(date: string): boolean {
    const deleted = this.entries.delete(date);
    if (deleted) this.save();
    return deleted;
  }

  getTotalForMonth(year: number, month: number): number {
    return this.getEntriesForMonth(year, month).length;
  }
}
