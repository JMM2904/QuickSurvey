import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { HeroSectionComponent } from '../../shared/hero-section/hero-section.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, HeroSectionComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {}
