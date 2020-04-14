import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Symbol } from '../classes/symbol.class';
import { Interval } from '../classes/interval.class';

@Injectable({providedIn: 'root'})
export class ApiService {
    constructor(private http: HttpClient) {}

    private baseUrl: string = environment.apiUrl;
    
    getExchanges(): Observable<string[]> {
        let endpoint: string = "/exchange/";
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<string[]>(url);
    }

    getIntervals(): Observable<string[]> {
        let endpoint: string = "/exchange/intervals";
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<string[]>(url);
    }

    getSymbols(): Observable<Symbol[]> {
        let endpoint: string = "/volume/symbols";
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<Symbol[]>(url);
    }

    getIntervalsByExchange(exchange: string): Observable<Interval[]> {
        let endpoint: string = `/volume/exchanges/${exchange}`;
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<Interval[]>(url);
    }

    executeCustomRun(exchange: string, size: string, percent: number): Observable<string> {
        let endpoint: string = `/volume/exchanges/${exchange}/size/${size}/percent/${percent}/custom`;
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<string>(url);
    }
}