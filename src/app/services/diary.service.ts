import { Injectable } from '@angular/core';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'ph_diary';

@Injectable({ providedIn: 'root' })
export class DiaryService {
  private entries: DiaryEntry[] = [];

  constructor() {
    this.load();
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) this.entries = JSON.parse(raw);
    } catch {
      this.entries = [];
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.entries));
  }

  getAll(): DiaryEntry[] {
    return [...this.entries].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  get(id: string): DiaryEntry | undefined {
    return this.entries.find((e) => e.id === id);
  }

  add(title: string, content: string): DiaryEntry {
    const id = `diary_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const now = new Date().toISOString();
    const entry: DiaryEntry = {
      id,
      title: title.trim() || 'Senza titolo',
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    };
    this.entries.push(entry);
    this.save();
    return entry;
  }

  update(id: string, title: string, content: string): DiaryEntry | undefined {
    const entry = this.entries.find((e) => e.id === id);
    if (!entry) return undefined;
    entry.title = title.trim() || 'Senza titolo';
    entry.content = content.trim();
    entry.updatedAt = new Date().toISOString();
    this.save();
    return entry;
  }

  remove(id: string): boolean {
    const idx = this.entries.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.entries.splice(idx, 1);
    this.save();
    return true;
  }
}
