import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  @Input() activeRoute: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  setActiveRoute(route: string): void {
    if (route === 'inicio') {
      this.router.navigate(['/dashboard']);
    } else if (route === 'crear') {
      this.router.navigate(['/create-survey']);
    } else if (route === 'encuestas') {
      this.router.navigate(['/my-surveys']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
