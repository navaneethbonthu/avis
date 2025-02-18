import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { log } from "node:console";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../shared/data-access/auth.service";
import { response } from "express";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authToken = localStorage.getItem('authToken');
    const router = inject(Router);
    const authService = inject(AuthService);

    const reqClone = req.clone({
        setHeaders: {
            Authorization: `Bearer ${authToken}`
        }
    });
    // generate refresh token once the token expires
    return next(reqClone)
        // .pipe(
        //     catchError((err: HttpErrorResponse) => {
        //         if (err.status === 401) {
        //             // authService.logout();
        //             console.log('test',err);
        //             authService.getRefeshToken().pipe(
        //                 switchMap(
        //                     ({ authToken }) => {
        //                         const reqClone = req.clone({
        //                             setHeaders: {
        //                                 Authorization: `Bearer ${authToken}`
        //                             }
        //                         });
        //                         return next(reqClone);
        //                     }
        //                 ),
        //                 catchError((err) => {
        //                     if (err.state === 401) {
        //                         authService.logout();
        //                     } else if (err.status === 403) {
        //                         router.navigate(['/']);
        //                     }
        //                     return err;
        //                 }),
        //             );
        //         }
        //         throw err;
        //     })
        // );

}
