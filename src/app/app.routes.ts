import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./welcome/welcome.component').then(m => m.WelcomeComponent) },
  { path: 'activity', loadComponent: () => import('./activity/activity.component').then(m => m.ActivityComponent) },
  { path: 'todos', loadComponent: () => import('./todos/todos.component').then(m => m.TodosComponent) },
  { path: 'finance', loadComponent: () => import('./finance/finance.component').then(m => m.FinanceComponent) },
  { path: 'settings', loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent) },
  { path: '**', redirectTo: '' },
];
