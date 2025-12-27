import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
})
export class HeroSectionComponent {
  constructor(private router: Router, private authService: AuthService) {}

  startSurvey() {
    // Si está autenticado, ir a surveys
    // Si no está autenticado, ir a register
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/surveys']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}
