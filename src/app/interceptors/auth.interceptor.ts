import { HttpErrorResponse, HttpHandlerFn,  HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    const authToken = localStorage.getItem('authToken');
    const router = inject(Router);

    if(!req.url.startsWith('http')){ // Corrected header name
        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return next(modifiedReq);
    }

    return next(req)
    // .pipe(
    //     catchError((error: HttpErrorResponse) => {
    //         if (error.status === 401 && authToken) {
    //             return handle401Error(req, next, injector);
    //         } else if (error.status === 403) {
    //             console.log('interceptor error');
                
    //             router.navigate(['/page-not-found']);
    //             return next(req); // Return an observable
    //         }
    //         return throwError(() => error); // Return an observable
    //     })
    // );
}

// function cloneRequestWithToken(req: HttpRequest<unknown>, token: string | null) {
//     return req.clone({
//         setHeaders: {
//             Authorization: `Bearer ${token}`
//         }
//     });
// }

// function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn  , injector: Injector) {
//     const router = injector.get(Router);
//     localStorage.removeItem('authToken');
//     router.navigate(['/login']);
//     return next(req);
// }
