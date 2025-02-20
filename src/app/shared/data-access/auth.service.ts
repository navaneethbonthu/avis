import { computed, inject, Injectable, signal } from '@angular/core';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, OperatorFunction, EMPTY } from 'rxjs';
import { catchError, tap, filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Iuser } from './auth';
import { LocalStorage } from '../../providers/local-storage';


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


  private localStorage = inject(LocalStorage);

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
        this.localStorage.set('user_info', JSON.stringify(response));

        this.setAuthstate(response);


        this.localStorage.set('user_info', response);
        this.localStorage.set('authToken', response.accessToken);
        this.localStorage.set('refreshToken', response.refreshToken);

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
    this.localStorage.set('user_info', JSON.stringify(res));
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!this.localStorage.get('authToken');
    }
    else {
      return false
    }
  }

  logout(): void {
    this.authStatus.set('Unauthenticated');
    this.localStorage.remove('authToken');
    this.router.navigate(['/login']);
  }


  public currentUser() {
    const authToken = this.localStorage.get('authToken');
    return this.http.get<Iuser>('auth/me').pipe(
      catchError((error) => {
        throw error;
      })
    )
  }



  public getRefeshToken(): Observable<{ authToken: string; }> {
    const refreshToken = this.localStorage.get('refreshToken');
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
          this.localStorage.set('accessToken', token.accessToken);
          this.localStorage.set('refreshToken', token.refreshToken);
        }),
        map((token) => ({ authToken: token.accessToken }))
      );
  }



}
