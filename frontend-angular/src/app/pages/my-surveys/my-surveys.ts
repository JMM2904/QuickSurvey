import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SurveyService, Survey } from '../../services/survey.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-surveys',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-surveys.html',
  styleUrls: ['./my-surveys.css'],
})
export class MySurveysComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  surveys: Survey[] = [];
  allSurveys: Survey[] = [];
  activeRoute: string = 'encuestas';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private surveyService: SurveyService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadMySurveys();

    // Configurar búsqueda en tiempo real
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.filterSurveys(query);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMySurveys(): void {
    this.surveyService
      .getMySurveys()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (surveys) => {
          this.allSurveys = surveys;
          this.surveys = surveys;
        },
        error: (error) => {
          console.error('Error al cargar mis encuestas:', error);
        },
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  filterSurveys(query: string): void {
    if (!query.trim()) {
      this.surveys = this.allSurveys;
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.surveys = this.allSurveys.filter(
      (survey) =>
        survey.title.toLowerCase().includes(lowerQuery) ||
        survey.description?.toLowerCase().includes(lowerQuery)
    );
  }

  setActiveRoute(route: string): void {
    this.activeRoute = route;
    if (route === 'inicio') {
      this.router.navigate(['/dashboard']);
    } else if (route === 'crear') {
      this.router.navigate(['/create-survey']);
    }
  }

  viewSurvey(surveyId: number): void {
    this.router.navigate(['/survey', surveyId, 'results']);
  }

  toggleSurveyStatus(survey: Survey): void {
    const newStatus = !survey.is_active;
    this.surveyService.updateSurvey(survey.id, { is_active: newStatus }).subscribe({
      next: () => {
        survey.is_active = newStatus;
        const action = newStatus ? 'reactivada' : 'finalizada';
        this.notificationService.show(`Encuesta ${action} exitosamente`, 'success');
      },
      error: (error) => {
        console.error('Error al actualizar encuesta:', error);
        this.notificationService.show('Error al actualizar la encuesta', 'error');
      },
    });
  }

  getVotesCount(survey: Survey): number {
    return survey.votes_count || 0;
  }

  getStatusText(survey: Survey): string {
    return survey.is_active ? 'Activa' : 'Finalizado';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
