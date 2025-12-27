import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.scss',
})
export class SurveysComponent implements OnInit {
  surveys: any[] = [];

  constructor() {}

  ngOnInit(): void {
    // TODO: Cargar encuestas del usuario desde el backend
    this.surveys = [];
  }

  createSurvey(): void {
    // TODO: Implementar creación de encuesta
    console.log('Crear nueva encuesta');
  }
}
