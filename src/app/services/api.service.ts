import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private apiUrl = environment.apiUrl;
    private mockDbUrl = 'assets/data/mockDb.json';
    private useMock = true; // Set to true to use mock data (backend not running)

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string): Observable<T> {
        if (this.useMock) {
            return this.http.get<any>(this.mockDbUrl).pipe(
                map(db => db[endpoint] as T),
                catchError(error => {
                    console.error('Mock DB error', error);
                    return of([] as unknown as T);
                })
            );
        }
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`);
    }

    post<T>(endpoint: string, data: any): Observable<T> {
        if (this.useMock) {
            console.log(`Mock POST to ${endpoint}`, data);
            return of(data as T);
        }
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data);
    }

    put<T>(endpoint: string, data: any): Observable<T> {
        if (this.useMock) {
            console.log(`Mock PUT to ${endpoint}`, data);
            return of(data as T);
        }
        return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data);
    }

    delete<T>(endpoint: string): Observable<T> {
        if (this.useMock) {
            console.log(`Mock DELETE to ${endpoint}`);
            return of({} as T);
        }
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}`);
    }
}
