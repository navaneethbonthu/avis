import { Inject, InjectionToken, ValueProvider } from "@angular/core";


export function provideEnvConfig(config: {apiUrl:string}): ValueProvider {
    return {
        provide: new InjectionToken<{apiUrl:string}>('ENVIRONMENT'),
        useValue: config
    };
}