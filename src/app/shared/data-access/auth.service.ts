import { computed, Injectable, signal } from '@angular/core';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, OperatorFunction, EMPTY } from 'rxjs';
import { catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Iuser } from './auth';


export type AuthStatus = 'Authenticated' | 'Unauthenticated' | 'Authenticating' | 'Error';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public authStatus = signal<AuthStatus>('Unauthenticated');
  public authUser = signal<Iuser | undefined>(undefined);
  public authError = signal<string | undefined>(undefined);

  public _authStatus = this.authStatus.asReadonly();
  public _authUser = computed(() => this.authUser());
  public _authError = this.authError.asReadonly();

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string | undefined, password: string | undefined): void {


    this.authStatus.set('Authenticating');
    this.http.post<any>('auth/login', { username, password, expiresInMins: 1 })
      .pipe(
        catchError((error) => {
          this.authStatus.set('Error');
          this.authError.set(error.message);
          // console.log('test',error.message);
          return EMPTY;
        })
      ).subscribe((response) => {

        this.authStatus.update(() => 'Authenticated');
        localStorage.setItem('user_info', JSON.stringify(response));

        this.setAuthstate(response);

        // console.log('res', response);
        if (typeof window !== 'undefined' && window.localStorage) {

          localStorage.setItem('user_info', response);
          localStorage.setItem('authToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);

        }
        if (this.isLoggedIn()) {
          this.router.navigate(['pages/dash-board']);
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  public setAuthstate(res: Iuser) {
    this.authUser.update(() => res);
    this.authStatus.update(() => 'Authenticated');
    localStorage.setItem('user_info', JSON.stringify(res));
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('authToken');
    }
    else {
      return false
    }
  }

  logout(): void {
    this.authStatus.set('Unauthenticated');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }


  public currentUser() {
    const authToken = localStorage.getItem('authToken');
    return this.http.get<Iuser>('auth/me').pipe(
      catchError((error) => {
        throw error;
      })
    )
  }



  public getRefeshToken(): Observable<{ authToken: string; }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<{ accessToken: string; refreshToken: string }>('auth/refresh', {
        refreshToken,
        expiresInMins: 10
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          throw error;
        }),
        tap((token) => {
          localStorage.setItem('accessToken', token.accessToken);
          localStorage.setItem('refreshToken', token.refreshToken);
        }),
        map((token) => ({ authToken: token.accessToken }))
      );
  }



}
