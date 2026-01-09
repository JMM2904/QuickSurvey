import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';
import { SurveyService, Survey } from '../../services/survey.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  surveys: Survey[] = [];
  allSurveys: Survey[] = [];
  filteredSurveys: Survey[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;
  currentUser: User | null = null;
  activeRoute: string = 'admin';
  totalUsers = 0;
  totalSurveys = 0;
  totalVotes = 0;
  showDeleteModal = false;
  surveyToDelete: number | null = null;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private surveyService: SurveyService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          const isAdmin = (user as any)?.role === 'admin';

          if (!isAdmin) {
            this.router.navigate(['/dashboard']);
            return;
          }

          this.loadSurveys();
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
          this.router.navigate(['/dashboard']);
        },
      });

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
      .getAdminStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.totalUsers = stats.totalUsers;
          this.totalSurveys = stats.totalSurveys;
          this.totalVotes = stats.totalVotes;
        },
        error: (error) => {
          console.error('Error al cargar estadísticas:', error);
        },
      });

   
    this.surveyService
      .getAdminSurveys()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (surveys) => {
          this.allSurveys = surveys;
          this.filteredSurveys = surveys;
          this.applyPagination();
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
      this.filteredSurveys = this.allSurveys;
      this.currentPage = 1;
      this.applyPagination();
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.filteredSurveys = this.allSurveys.filter(
      (survey) =>
        survey.title.toLowerCase().includes(lowerQuery) ||
        survey.description?.toLowerCase().includes(lowerQuery) ||
        survey.user?.name.toLowerCase().includes(lowerQuery)
    );

    this.currentPage = 1;
    this.applyPagination();
  }

  applyPagination(): void {
    const total = this.filteredSurveys.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.surveys = this.filteredSurveys.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }

  viewSurvey(surveyId: number): void {
    this.router.navigate(['/survey', surveyId, 'results']);
  }

  deleteSurvey(surveyId: number): void {
    this.surveyToDelete = surveyId;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.surveyToDelete === null) return;

    this.surveyService
      .deleteSurvey(this.surveyToDelete)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.show('Encuesta eliminada', 'success');
          this.closeDeleteModal();
          this.loadSurveys();
        },
        error: () => {
          this.notificationService.show('Error al eliminar la encuesta', 'error');
          this.closeDeleteModal();
        },
      });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.surveyToDelete = null;
  }

  getVotesCount(survey: Survey): number {
    return survey.votes_count || 0;
  }

  getVotesText(survey: Survey): string {
    const count = this.getVotesCount(survey);
    return count === 1 ? 'voto' : 'votos';
  }
}

