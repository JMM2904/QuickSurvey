import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private tokenKey = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(name: string, email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/register`, {
        name,
        email,
        password,
        password_confirmation: password,
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.saveToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.saveToken(response.token);
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<User>(`${this.apiUrl}/user`, { headers }).pipe(
      tap((user: User) => {
        this.currentUserSubject.next(user);
      })
    );
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }
}
