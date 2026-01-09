import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SurveyService, Survey } from '../../services/survey.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-my-surveys',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './my-surveys.html',
  styleUrls: ['./my-surveys.css'],
})
export class MySurveysComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  surveys: Survey[] = [];
  allSurveys: Survey[] = [];
  filteredSurveys: Survey[] = [];
  paginatedSurveys: Survey[] = [];
  activeRoute: string = 'encuestas';
  confirmingDeleteId: number | null = null;
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

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
          this.filteredSurveys = surveys;
          this.currentPage = 1;
          this.applyPagination();
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
      this.filteredSurveys = this.allSurveys;
      this.currentPage = 1;
      this.applyPagination();
      return;
    }

    const lowerQuery = query.toLowerCase();
    this.filteredSurveys = this.allSurveys.filter(
      (survey) =>
        survey.title.toLowerCase().includes(lowerQuery) ||
        survey.description?.toLowerCase().includes(lowerQuery)
    );

    this.currentPage = 1;
    this.applyPagination();
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

  askDelete(surveyId: number): void {
    this.confirmingDeleteId = surveyId;
  }

  cancelDelete(): void {
    this.confirmingDeleteId = null;
  }

  confirmDelete(survey: Survey): void {
    this.surveyService.deleteSurvey(survey.id).subscribe({
      next: () => {
        this.allSurveys = this.allSurveys.filter((s) => s.id !== survey.id);
        this.filteredSurveys = this.filteredSurveys.filter((s) => s.id !== survey.id);
        this.applyPagination();
        this.confirmingDeleteId = null;
        this.notificationService.show('Encuesta eliminada', 'success');
      },
      error: (error) => {
        console.error('Error al eliminar encuesta:', error);
        this.notificationService.show('Error al eliminar la encuesta', 'error');
      },
    });
  }

  getVotesCount(survey: Survey): number {
    return survey.votes_count || 0;
  }

  getVotesText(survey: Survey): string {
    const count = this.getVotesCount(survey);
    return count === 1 ? 'voto' : 'votos';
  }

  getStatusText(survey: Survey): string {
    return survey.is_active ? 'Activa' : 'Finalizado';
  }

  shareLink(surveyId: number, event: Event): void {
    event.stopPropagation();
    const url = `${window.location.origin}/survey/${surveyId}/vote`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        this.notificationService.show('Enlace copiado al portapapeles', 'success');
      })
      .catch(() => {
        this.notificationService.show('Error al copiar el enlace', 'error');
      });
  }

  applyPagination(): void {
    const total = this.filteredSurveys.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedSurveys = this.filteredSurveys.slice(start, end);
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
}

