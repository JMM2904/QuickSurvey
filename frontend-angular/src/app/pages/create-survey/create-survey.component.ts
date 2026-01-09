import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

interface SurveyOption {
  text: string;
  color: string;
}

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
})
export class CreateSurveyComponent {
  title: string = '';
  description: string = '';
  options: SurveyOption[] = [
    { text: '', color: '#ff0000' },
    { text: '', color: '#0000ff' },
  ];
  activeRoute: string = 'crear';

  availableColors: string[] = [
    '#ff0000',
    '#0000ff',
    '#00ff00',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ff8800',
    '#8800ff',
  ];

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  setActiveRoute(route: string): void {
    this.activeRoute = route;
    if (route === 'inicio') {
      this.router.navigate(['/dashboard']);
    } else if (route === 'encuestas') {
      this.router.navigate(['/my-surveys']);
    }
  }

  addOption(): void {
   
    const usedColors = this.options.map((opt) => opt.color);
    const availableColor =
      this.availableColors.find((color) => !usedColors.includes(color)) || this.availableColors[0];

    this.options.push({
      text: '',
      color: availableColor,
    });
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.splice(index, 1);
    }
  }

  createSurvey(): void {
   
    if (!this.title.trim()) {
      this.notificationService.show('Por favor, ingresa un título para la encuesta', 'error');
      return;
    }

    if (this.options.length < 2) {
      this.notificationService.show('La encuesta debe tener al menos 2 opciones', 'error');
      return;
    }

    const validOptions = this.options.filter((opt) => opt.text.trim());
    if (validOptions.length < 2) {
      this.notificationService.show('Completa al menos 2 opciones', 'error');
      return;
    }

   
    const surveyData: any = {
      title: this.title,
      description: this.description || null,
      options: validOptions.map((opt) => ({
        text: opt.text,
        color: opt.color,
      })),
    };

    this.surveyService.createSurvey(surveyData).subscribe({
      next: (response) => {
        console.log('Encuesta creada:', response);
        this.notificationService.show('¡Encuesta creada exitosamente!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error al crear encuesta:', error);
        this.notificationService.show('Error al crear la encuesta. Intenta de nuevo.', 'error');
      },
    });
  }
}

