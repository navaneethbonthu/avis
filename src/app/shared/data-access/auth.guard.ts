import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LOCAL_STORAGE, LocalStorage } from '../../providers/local-storage';

export const authGuard = (type: 'protected' | 'unprotected'): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
    // console.log('blah', route.url)

    const router = inject(Router);
    const localStore = inject(LocalStorage);

    if (type === 'unprotected' && !localStore.get('authToken')) {
      return of(true);
    }

    if (authService.authStatus() === 'Authenticated') {
      return of(true);
    }

    return authService.currentUser().pipe(
      switchMap((user) => {
        // console.log('user', user);
        authService.setAuthstate(user);
        if (user) {
          return route.url[0].path === 'login'
            ? of(router.createUrlTree(['/pages/dash-board'])) : of(true);
        } else {
          return of(router.createUrlTree(['/login']));
        }
      }),
      catchError((err) => {
        console.log('err', err);
        const urlToRedirect = err?.status === 401 ? '/login' : '/page-not-found';
        return of(router.createUrlTree([urlToRedirect]));
      })
    );
  };
};
