import { Inject, InjectionToken, ValueProvider } from "@angular/core";


export interface EnvironmentConfig{
    apiUrl: string;
}

export const ENVIRONMENT = new InjectionToken<EnvironmentConfig>('ENVIRONMENT');


export function provideEnvConfig(config: EnvironmentConfig): ValueProvider {
    return {
        provide: ENVIRONMENT,
        useValue: config
    };
}