import { Component } from '@angular/core';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  template: `
    <div class="status-bar" aria-hidden="true">
      <span class="status-time">9:41</span>
      <div class="status-icons">
        <svg class="status-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2v8h6v-6h2v6h6v-8l2-2V3H1v6z"/></svg>
        <svg class="status-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9h2v8H1V9zm4 4h2v4H5v-4zm4-8h2v12H9V5zm4 4h2v8h-2V9zm4-6v14h2V7h-2z"/></svg>
      </div>
    </div>
  `,
  styles: [`
    .status-bar {
      padding: calc(var(--ph-header-safe) + 8px) var(--ph-space-md) 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--ph-text-primary);
      background: var(--ph-primary-bg);
    }
    .status-icons {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .status-icon {
      width: 18px;
      height: 18px;
      opacity: 0.9;
    }
  `],
})
export class StatusBarComponent {}
