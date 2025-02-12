import { Injectable, signal } from '@angular/core';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, OperatorFunction, EMPTY } from 'rxjs';
import { catchError, tap, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Iuser } from './auth';
import e from 'express';


export type AuthStatus = 'Authenticated' | 'Unauthenticated' | 'Authenticating' | 'Error' ;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    // private apiUrl = 'https://dummyjson.com/auth/login';

    public authStatus = signal<AuthStatus>('Unauthenticated');
    public authUser = signal<Iuser |  undefined >(undefined);
    public authError = signal< string |  undefined >(undefined);

    public _authStatus = this.authStatus.asReadonly();  
    public _authUser = this.authUser.asReadonly();
    public _authError = this.authError.asReadonly();

    constructor(private http: HttpClient, private router: Router) {}
  
    login(username: string | undefined, password: string | undefined): void {
      this.authStatus.set('Authenticating');
       this.http.post<any>('auth/login', { username, password })
        .pipe(
          catchError((error) => {
            this.authStatus.set('Error');
            this.authError.set(error.message);
            return EMPTY;})
        ).subscribe((response) => {
          this.authStatus.update(() => 'Authenticated');
          localStorage.setItem('user_info', JSON.stringify(response))
          this.authUser.update(() => response)
            console.log('res',response);
          if (response.accessToken) {
            
            localStorage.setItem('user_info', response);
            localStorage.setItem('authToken', response.accessToken);

          }
          if(this.isLoggedIn()){
            this.router.navigate(['pages/dash-board']);
          }else{
            this.router.navigate(['/login']);
          }
        });
    }
  
    isLoggedIn(): boolean {
      return !!localStorage.getItem('authToken');
    }
  
    logout(): void {
      this.authStatus.set('Unauthenticated');
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
}
