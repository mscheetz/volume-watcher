import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Symbol } from '../classes/symbol.class';
import { Interval } from '../classes/interval.class';
import { RequestItem } from '../classes/request-item.class';
import { CustomInterval } from '../classes/custom-interval.class';
import { VolumeOverAverge } from '../classes/volume-over-average.class';
import { PagedResponse } from '../classes/paged-response.class';

@Injectable({providedIn: 'root'})
export class ApiService {
    constructor(private http: HttpClient) {}

    private baseUrl: string = `${environment.apiUrl}/api`;
    
    getExchanges(): Observable<string[]> {
        let endpoint: string = "/volume/exchanges";

        return this.onGet<string[]>(endpoint);
    }

    getIntervals(): Observable<string[]> {
        let endpoint: string = "/volume/sizes";

        return this.onGet<string[]>(endpoint);
    }

    getSymbols(): Observable<Symbol[]> {
        let endpoint: string = "/volume/symbols";

        return this.onGet<Symbol[]>(endpoint);
    }

    getIntervalsByExchange(exchange: string): Observable<CustomInterval[]> {
        let endpoint: string = `/volume/exchanges/${exchange}`;

        return this.onGet<CustomInterval[]>(endpoint);
    }

    getCurrent(): Observable<CustomInterval[]> {
        let endpoint: string = `/volume`;

        return this.onGet<CustomInterval[]>(endpoint);
    }

    executeCustomRunGet(exchange: string, size: string, percent: number): Observable<string> {
        let endpoint: string = `/volume/exchanges/${exchange}/size/${size}/percent/${percent}/custom`;

        return this.onGet<string>(endpoint);
    }

    executeCustomRun(data: RequestItem): Observable<string> {
        let endpoint: string = `/volume/custom`;

        return this.onPost<string, RequestItem>(endpoint, data);
    }

    getVOA(): Observable<VolumeOverAverge[]>{
        let endpoint: string = `/voa`;

        return this.onGet<VolumeOverAverge[]>(endpoint);
    }

    getVOAPaged(page: number, size: number): Observable<PagedResponse<VolumeOverAverge[]>>{
        let endpoint: string = `/voa`;
        let data = {
            page: page,
            size: size
        };

        return this.onPost<PagedResponse<VolumeOverAverge[]>, any>(endpoint, data);
    }

    private onGet<T>(endpoint: string): Observable<T> {
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.get<T>(url);
    }

    private onPost<T, U>(endpoint: string, data: U): Observable<T> {
        let url: string = `${this.baseUrl}${endpoint}`;

        return this.http.post<T>(url, data);
    }
}