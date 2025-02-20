import { DOCUMENT } from "@angular/common";
import { inject, Injectable, InjectionToken } from "@angular/core";


export const LOCAL_STORAGE = new InjectionToken<Storage | null>('Local Storage', {

    factory: () => {
        const document = inject(DOCUMENT).defaultView;
        return document?.localStorage ?? null
    }

});

@Injectable({
    providedIn: 'root'
})
export class LocalStorage {

    private readonly storage = inject(LOCAL_STORAGE);


    public set(key: string, value: string | object) {

        if (!this.storage) return;

        if (typeof value === 'object') {
            this.storage.setItem(key, JSON.stringify(value));
        } else {
            this.storage.setItem(key, value);
        }
    }

    public get<TData = string>(key: string): any {
        if (!this.storage) return null;

        const data = this.storage.getItem(key);

        if (!data) return null;

        try {
            const parsedData = JSON.parse(data);
            if (typeof parsedData === 'object') {
                return parsedData as TData extends object ? TData : string;
            }
        } catch (err) {
            return data as TData extends object ? TData : string
        }

    }

    public remove(key: string) {
        if (!this.storage) return;
        this.storage.removeItem(key);
    }

    public clear() {
        if (!this.storage) return;
        this.storage.clear();
    }






}