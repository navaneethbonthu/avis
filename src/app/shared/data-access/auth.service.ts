import { Injectable, signal } from '@angular/core';


import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, OperatorFunction } from 'rxjs';
import { catchError, tap, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Iuser } from './auth';


export type AuthStatus = 'Authenticated' | 'Unauthenticated' | 'Authenticating' | 'Error' ;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private apiUrl = 'https://dummyjson.com/auth/login';

    public authStatus = signal<AuthStatus>('Unauthenticated');
    public authUser = signal<Iuser |  undefined >(undefined);



    public _authStatus = this.authStatus.asReadonly();
    public _authUser = this.authUser.asReadonly();

    










    constructor(private http: HttpClient, private router: Router) {}
  
    login(username: string, password: string): Observable<any> {
      this.authStatus.set('Authenticating');
      return this.http.post<any>(this.apiUrl, { username, password })
        .pipe(
          tap(response => {
            this.authStatus.update(() => 'Authenticated');
            localStorage.setItem('user_info', JSON.stringify(response))
            this.authUser.update(() => response)
              console.log('res',response);
            if (response.accessToken) {
              
              localStorage.setItem('user_info', response);
              localStorage.setItem('authToken', response.accessToken);

            }
          })
        );
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
