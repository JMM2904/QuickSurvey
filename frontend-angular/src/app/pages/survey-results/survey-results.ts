import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SurveyService, Survey, SurveyOption } from '../../services/survey.service';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-survey-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './survey-results.html',
  styleUrls: ['./survey-results.css'],
})
export class SurveyResultsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  survey: Survey | null = null;
  activeRoute: string = '';
  private destroy$ = new Subject<void>();
  private chart: Chart | null = null;
  private viewInitialized = false;

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const surveyId = this.route.snapshot.params['id'];
    this.loadSurveyResults(surveyId);
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    // Si los datos ya llegaron, crear el gráfico ahora
    if (this.survey) {
      setTimeout(() => this.createChart(), 100);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadSurveyResults(surveyId: number): void {
    this.surveyService
      .getSurvey(surveyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (survey) => {
          this.survey = survey;
          // Si la vista ya está inicializada, crear el gráfico
          if (this.viewInitialized) {
            setTimeout(() => this.createChart(), 100);
          }
        },
        error: (error) => {
          console.error('Error al cargar resultados:', error);
          this.router.navigate(['/dashboard']);
        },
      });
  }

  createChart(): void {
    console.log('createChart llamado', {
      survey: this.survey,
      chartCanvas: this.chartCanvas,
      options: this.survey?.options,
    });

    if (!this.survey || !this.chartCanvas || !this.survey.options) {
      console.error('Faltan datos para crear el gráfico');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('No se pudo obtener el contexto del canvas');
      return;
    }

    // Calcular total de votos
    const totalVotes = this.survey.options.reduce((sum, option) => {
      return sum + (option.votes?.length || 0);
    }, 0);

    console.log('Total de votos:', totalVotes);

    // Preparar datos
    const labels = this.survey.options.map((option) => option.text);
    const votesPerOption = this.survey.options.map((option) => option.votes?.length || 0);
    const data = this.survey.options.map((option) => {
      const votes = option.votes?.length || 0;
      return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    });
    const colors = this.survey.options.map((option) => option.color || '#5112ff');

    console.log('Datos del gráfico:', { labels, data, colors, votesPerOption });

    // Destruir gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    console.log('Creando nuevo gráfico...');

    // Crear gráfico
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Porcentaje de votos',
            data: data,
            backgroundColor: colors,
            borderRadius: 8,
            barThickness: 80,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const votes = votesPerOption[context.dataIndex];
                const percentage = context.parsed.y;
                const votoText = votes === 1 ? 'voto' : 'votos';
                return `${votes} ${votoText} (${percentage}%)`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
            },
            grid: {
              color: '#e0e0e0',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    console.log('Gráfico creado exitosamente!');
  }

  setActiveRoute(route: string): void {
    this.activeRoute = route;
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
