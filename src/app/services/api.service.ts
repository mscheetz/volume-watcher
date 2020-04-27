import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Symbol } from '../classes/symbol.class';
import { Interval } from '../classes/interval.class';
import { RequestItem } from '../classes/request-item.class';
import { CustomInterval } from '../classes/custom-interval.class';

@Injectable({providedIn: 'root'})
export class ApiService {
    constructor(private http: HttpClient) {}

    private baseUrl: string = `${environment.apiUrl}/api`;
    
    getExchanges(): Observable<string[]> {
        let endpoint: string = "/volume/exchanges";
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<string[]>(url);
    }

    getIntervals(): Observable<string[]> {
        let endpoint: string = "/volume/sizes";
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<string[]>(url);
    }

    getSymbols(): Observable<Symbol[]> {
        let endpoint: string = "/volume/symbols";
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<Symbol[]>(url);
    }

    getIntervalsByExchange(exchange: string): Observable<CustomInterval[]> {
        let endpoint: string = `/volume/exchanges/${exchange}`;
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<CustomInterval[]>(url);
    }

    getCurrent(): Observable<CustomInterval[]> {
        let endpoint: string = `/volume`;
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<CustomInterval[]>(url);
    }

    executeCustomRunGet(exchange: string, size: string, percent: number): Observable<string> {
        let endpoint: string = `/volume/exchanges/${exchange}/size/${size}/percent/${percent}/custom`;
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<string>(url);
    }

    executeCustomRun(data: RequestItem): Observable<string> {
        let endpoint: string = `/volume/custom`;
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.post<string>(url, data);
    }
}