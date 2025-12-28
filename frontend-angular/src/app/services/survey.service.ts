import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface SurveyOption {
  id: number;
  survey_id: number;
  text: string;
  color?: string;
  votes_count?: number;
  votes?: any[];
}

export interface Survey {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  options?: SurveyOption[];
  votes_count?: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  getAllSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/surveys`, {
      headers: this.getHeaders(),
    });
  }

  getMySurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/my-surveys`, {
      headers: this.getHeaders(),
    });
  }

  searchSurveys(query: string): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/surveys?search=${encodeURIComponent(query)}`, {
      headers: this.getHeaders(),
    });
  }

  getSurvey(id: number): Observable<Survey> {
    return this.http.get<Survey>(`${this.apiUrl}/surveys/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createSurvey(survey: Partial<Survey>): Observable<Survey> {
    return this.http.post<Survey>(`${this.apiUrl}/surveys`, survey, {
      headers: this.getHeaders(),
    });
  }

  updateSurvey(id: number, survey: Partial<Survey>): Observable<Survey> {
    return this.http.put<Survey>(`${this.apiUrl}/surveys/${id}`, survey, {
      headers: this.getHeaders(),
    });
  }

  deleteSurvey(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/surveys/${id}`, {
      headers: this.getHeaders(),
    });
  }

  vote(surveyId: number, optionId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/surveys/${surveyId}/vote`,
      {
        survey_option_id: optionId,
      },
      {
        headers: this.getHeaders(),
      }
    );
  }
}
