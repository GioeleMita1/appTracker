import { Component } from '@angular/core';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ThemeToggleComponent],
  template: `
    <div class="settings-page">
      <header class="page-header">
        <h1 class="ph-h1 settings-title">Impostazioni</h1>
        <p class="ph-body header-sub">Preferenze dell'app</p>
      </header>

      <section class="settings-section ph-card">
        <h2 class="section-title">Aspetto</h2>
        <div class="setting-row">
          <span class="setting-label">Tema</span>
          <app-theme-toggle />
        </div>
      </section>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: var(--ph-space-md) var(--ph-space-md) var(--ph-space-xl);
      max-width: 480px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--ph-space-lg);
    }

    .settings-title {
      margin: 0 0 var(--ph-space-xs);
    }

    .header-sub {
      margin: 0;
    }

    .settings-section {
      padding: var(--ph-space-lg);
    }

    .section-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--ph-text-secondary);
      margin: 0 0 var(--ph-space-md);
    }

    .setting-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ph-space-md);
    }

    .setting-label {
      font-size: 0.9375rem;
      color: var(--ph-text-primary);
    }
  `],
})
export class SettingsComponent {}
