import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../services/notification.service';

interface SurveyOption {
  text: string;
  color: string;
}

@Component({
  selector: 'app-create-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    '#ff0000', // Rojo
    '#0000ff', // Azul
    '#00ff00', // Verde
    '#ffff00', // Amarillo
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#ff8800', // Naranja
    '#8800ff', // Morado
  ];

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private notificationService: NotificationService
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
    // Asignar un color que no se haya usado todavía
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
    // Validar formulario
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

    // Crear encuesta
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
