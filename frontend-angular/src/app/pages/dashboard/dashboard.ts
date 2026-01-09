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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  surveys: Survey[] = [];
  allSurveys: Survey[] = [];
  filteredSurveys: Survey[] = [];
  currentPage = 1;
  totalPages = 1;
  pageSize = 6;
  currentUser: User | null = null;
  activeRoute: string = 'inicio';
  totalUsers = 0;
  totalSurveys = 0;
  totalVotes = 0;

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
        },
        error: (error) => {
          console.error('Error al obtener usuario:', error);
        },
      });

   
    this.loadSurveys();

   
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
          this.filteredSurveys = surveys;
          this.updateStats();
          this.applyPagination();
        },
        error: (error) => {
          console.error('Error al cargar encuestas:', error);
        },
      });
  }

  private updateStats(): void {
    this.totalSurveys = this.allSurveys.length;
    const uniqueUsers = new Set<number>();
    let votes = 0;

    this.allSurveys.forEach((survey) => {
      if (survey.user?.id) {
        uniqueUsers.add(survey.user.id);
      }
      votes += survey.votes_count || 0;
    });

    this.totalUsers = uniqueUsers.size;
    this.totalVotes = votes;
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

  participate(surveyId: number): void {
    this.router.navigate(['/survey', surveyId, 'vote']);
  }

  getVotesCount(survey: Survey): number {
    return survey.votes_count || 0;
  }

  getVotesText(survey: Survey): string {
    const count = this.getVotesCount(survey);
    return count === 1 ? 'voto' : 'votos';
  }

  getAuthorName(survey: Survey): string {
    return survey.user?.name || 'Anónimo';
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
}

