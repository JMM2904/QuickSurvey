import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SurveyService, Survey } from '../../services/survey.service';
import { AuthService, User } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-vote-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './vote-survey.html',
  styleUrls: ['./vote-survey.css'],
})
export class VoteSurveyComponent implements OnInit, OnDestroy {
  survey: Survey | null = null;
  selectedOptionId: number | null = null;
  activeRoute: string = '';
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const surveyId = Number(this.route.snapshot.params['id']);

    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.currentUser = user;
          this.loadSurvey(surveyId);
        },
        error: () => {
          // Si falla la carga del usuario, igualmente intentamos cargar la encuesta
          this.loadSurvey(surveyId);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSurvey(surveyId: number): void {
    this.surveyService
      .getSurvey(surveyId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (survey) => {
          if (!survey.is_active) {
            this.notificationService.show('La encuesta ya ha finalizado', 'error');
            this.router.navigate(['/dashboard']);
            return;
          }

          const isAdmin = (this.currentUser?.role || '').toLowerCase() === 'admin';

          if (this.currentUser && survey.user_id === this.currentUser.id && !isAdmin) {
            this.notificationService.show('No puedes votar tu propia encuesta', 'error');
            this.router.navigate(['/dashboard']);
            return;
          }

          // Si ya votó, redirigir a resultados
          const yaVoto =
            this.currentUser &&
            survey.options?.some((opt: any) =>
              opt.votes?.some((vote: any) => vote.user_id === this.currentUser!.id)
            );
          if (yaVoto && !isAdmin) {
            this.notificationService.show('Ya has votado esta encuesta', 'info');
            this.router.navigate(['/survey', survey.id, 'results']);
            return;
          }

          this.survey = survey;
        },
        error: (error) => {
          console.error('Error al cargar encuesta:', error);
          this.notificationService.show('Error al cargar la encuesta', 'error');
          this.router.navigate(['/dashboard']);
        },
      });
  }

  submitVote(): void {
    if (!this.selectedOptionId || !this.survey) {
      this.notificationService.show('Por favor selecciona una opción', 'error');
      return;
    }

    this.surveyService
      .vote(this.survey.id, this.selectedOptionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.show('¡Voto registrado exitosamente!', 'success');
          // Redirigir a los resultados después de votar
          setTimeout(() => {
            this.router.navigate(['/survey', this.survey!.id, 'results']);
          }, 1500);
        },
        error: (error) => {
          console.error('Error al votar:', error);
          const message =
            error.error?.error || error.error?.message || 'Error al registrar el voto';
          this.notificationService.show(message, 'error');
        },
      });
  }
}
