import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell" [class.app-shell-hub]="isHub()">
      <main class="app-main" [class.app-main-hub]="isHub()">
        <router-outlet />
      </main>
      @if (isHub()) {
        <nav class="bottom-nav" aria-label="Navigazione principale">
          <a routerLink="/activity" routerLinkActive="active" class="nav-item" aria-label="Home">
            <span class="nav-item-inner">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </span>
          </a>
          <a routerLink="/todos" routerLinkActive="active" class="nav-item" aria-label="To-Do">
            <span class="nav-item-inner">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </span>
          </a>
          <a routerLink="/finance" routerLinkActive="active" class="nav-item" aria-label="Finanza">
            <span class="nav-item-inner">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </span>
          </a>
          <a routerLink="/settings" routerLinkActive="active" class="nav-item" aria-label="Impostazioni">
            <span class="nav-item-inner">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </span>
          </a>
        </nav>
      }
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100dvh;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--ph-primary-bg);
      overflow: hidden;
    }
    .app-main {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: calc(88px + var(--ph-bottom-safe));
      touch-action: pan-y;
    }
    .bottom-nav {
      position: fixed;
      bottom: calc(12px + var(--ph-bottom-safe));
      left: 50%;
      transform: translateX(-50%) translateZ(0);
      width: calc(100% - 40px);
      max-width: 360px;
      height: 68px;
      background: var(--ph-nav-bg);
      border-radius: 9999px;
      box-shadow:
        0 -1px 0 rgba(255, 255, 255, 0.06),
        0 4px 12px rgba(0, 0, 0, 0.12),
        0 12px 32px rgba(0, 0, 0, 0.18);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: 0 12px;
      z-index: 100;
      backface-visibility: hidden;
    }
    .nav-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 52px;
      height: 52px;
      color: rgba(255, 255, 255, 0.92);
      text-decoration: none;
      border-radius: 50%;
      transition: color 0.2s ease, background 0.2s ease, transform 0.15s ease;
    }
    .nav-item:active {
      transform: scale(0.94);
    }
    .nav-item .nav-item-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .nav-item:hover {
      color: #fff;
    }
    .nav-item.active .nav-item-inner {
      background: #fff;
      color: var(--ph-nav-bg);
    }
    .nav-item.active {
      color: var(--ph-nav-bg);
    }
    .nav-item.active:active {
      transform: scale(0.96);
    }
    .nav-icon {
      width: 26px;
      height: 26px;
    }
    .app-main:not(.app-main-hub) {
      padding-bottom: 0;
    }
  `],
})
export class AppComponent {
  constructor(
    private router: Router,
    private theme: ThemeService
  ) {}

  isHub(): boolean {
    const url = this.router.url;
    return url !== '/' && url !== '' && !url.startsWith('/?');
  }
}
