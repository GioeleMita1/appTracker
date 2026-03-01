import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ph-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly stored = signal<Theme | null>(this.readStored());
  readonly theme = computed<Theme>(() => this.stored() ?? 'light');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.apply(this.theme());
  }

  private readStored(): Theme | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'dark' || v === 'light') return v;
    return null;
  }

  private apply(theme: Theme): void {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }

  setTheme(theme: Theme): void {
    this.stored.set(theme);
    this.apply(theme);
  }

  toggle(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
}
