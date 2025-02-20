import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEvent } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, filter, finalize, switchMap, take, throwError, Observable } from "rxjs";
import { AuthService } from "../shared/data-access/auth.service";
import { LocalStorage } from "../providers/local-storage";

let isRefreshing = false;
const pendingRequests = new BehaviorSubject<null | string>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {


    const localStorage = inject(LocalStorage);


    const authToken = localStorage.get('authToken');
    
    if (req.url.includes('auth/refresh')) {
        return next(req);
    }
    const router = inject(Router);
    const authService = inject(AuthService);

    const reqClone = req.clone({
        setHeaders: {
            Authorization: `Bearer ${authToken}`
        }
    });

    return next(reqClone).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                if (localStorage.get('authToken') && !isRefreshing) {
                    pendingRequests.next(null);
                    isRefreshing = true;
                    return authService.getRefeshToken().pipe(
                        switchMap(({ authToken }) => {
                            console.log('authToken', authToken);
                            
                            isRefreshing = false;
                            pendingRequests.next(authToken);
                            const newReqClone = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${authToken}`,
                                }
                            });
                            return next(newReqClone);
                        }),
                        catchError((refreshErr) => {
                            if (refreshErr.status === 401) {
                                authService.logout();
                            } else if (refreshErr.status === 403) {
                                router.navigate(['/']);
                            }
                            return throwError(refreshErr);
                        }),
                        finalize(() => (isRefreshing = false)),
                    );
                } else {
                    return pendingRequests.pipe(
                        filter((token) => token !== null),
                        take(1),
                        switchMap((token) => {
                            const newReqClone = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            return next(newReqClone);
                        })
                    );
                }
            } else if (err.status === 403) {
                router.navigate(['/page-not-found']);
            }
            return throwError(err);
        })
    );
};