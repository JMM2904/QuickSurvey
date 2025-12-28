import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';
import { SurveyService, Survey } from '../../services/survey.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  surveys: Survey[] = [];
  allSurveys: Survey[] = [];
  currentUser: User | null = null;
  activeRoute: string = 'inicio';

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private surveyService: SurveyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.currentUser = user;
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
        },
      });

    // Cargar encuestas
    this.loadSurveys();

    // Configurar búsqueda en tiempo real con debounce
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

  loadSurveys(): void {
    this.surveyService
      .getAllSurveys()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (surveys) => {
          this.allSurveys = surveys;
          this.surveys = surveys;
        },
        error: (error) => {
          console.error('Error al cargar encuestas:', error);
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
        survey.description?.toLowerCase().includes(lowerQuery) ||
        survey.user?.name.toLowerCase().includes(lowerQuery)
    );
  }

  setActiveRoute(route: string): void {
    this.activeRoute = route;
    if (route === 'crear') {
      this.router.navigate(['/create-survey']);
    } else if (route === 'encuestas') {
      this.router.navigate(['/my-surveys']);
    }
  }

  participate(surveyId: number): void {
    console.log('Participar en encuesta:', surveyId);
    // Implementar navegación a la encuesta
  }

  getVotesCount(survey: Survey): number {
    return survey.votes_count || 0;
  }

  getAuthorName(survey: Survey): string {
    return survey.user?.name || 'Anónimo';
  }
}
