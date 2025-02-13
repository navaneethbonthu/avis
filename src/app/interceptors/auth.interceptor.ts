import { HttpErrorResponse, HttpHandlerFn,  HttpInterceptorFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const injector = inject(Injector);
    const authToken = localStorage.getItem('authToken');
    const router = inject(Router);

    const baseUrl: string = 'https://dummyjson.com/';

    if(!req.url.startsWith('http')){ 
        const reqClone = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authToken}`
            }
        });
        return next(reqClone);
    }

    return next(req)
   
}
