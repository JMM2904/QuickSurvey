import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
 
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
 
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-dashboard/admin-dashboard').then((m) => m.AdminDashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'create-survey',
    loadComponent: () =>
      import('./pages/create-survey/create-survey.component').then((m) => m.CreateSurveyComponent),
    canActivate: [authGuard],
  },
  {
    path: 'my-surveys',
    loadComponent: () => import('./pages/my-surveys/my-surveys').then((m) => m.MySurveysComponent),
    canActivate: [authGuard],
  },
  {
    path: 'survey/:id/vote',
    loadComponent: () =>
      import('./pages/vote-survey/vote-survey').then((m) => m.VoteSurveyComponent),
    canActivate: [authGuard],
  },
  {
    path: 'survey/:id/results',
    loadComponent: () =>
      import('./pages/survey-results/survey-results').then((m) => m.SurveyResultsComponent),
    canActivate: [authGuard],
  },
];

