import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  loading = signal(false);

  constructor(private router: Router) {}

  enterHub(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.router.navigate(['/activity']);
    }, 2500);
  }
}
