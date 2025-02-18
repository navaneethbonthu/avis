import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, InjectionToken } from "@angular/core";

export const withBaseUrl:HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if(req.url.startsWith('http')) {
        const urlConfig = inject( new InjectionToken<{apiUrl:string}>('ENVIRONMENT'));
        req.clone({url: `${urlConfig.apiUrl}/${req.url}`})
    }
    return next(req);
}
