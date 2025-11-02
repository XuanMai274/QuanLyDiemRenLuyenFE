import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SemesterService {
    private apiUrl = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }
    getAllSemesters(): Observable<any> {
        return this.http.get(`${this.apiUrl}/getAll`);
    }
}