import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  @Input() activeRoute: string = '';
  sidebarOpen = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.isAdmin = (user as any)?.role === 'admin';
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  setActiveRoute(route: string): void {
    if (route === 'inicio') {
      this.router.navigate(['/dashboard']);
    } else if (route === 'crear') {
      this.router.navigate(['/create-survey']);
    } else if (route === 'encuestas') {
      this.router.navigate(['/my-surveys']);
    } else if (route === 'admin') {
      this.router.navigate(['/admin']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
