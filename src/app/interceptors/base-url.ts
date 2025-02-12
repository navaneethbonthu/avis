import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject, InjectionToken } from "@angular/core";
import { ENVIRONMENT } from "../providers/environment";

export const withBaseUrl: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    if (req.url.startsWith('http')) {
        const urlConfig = inject(ENVIRONMENT);
        const modifiedReq = req.clone({ url: `${urlConfig.apiUrl}/${req.url}` });
        return next(modifiedReq);
    }
    return next(req);
}
