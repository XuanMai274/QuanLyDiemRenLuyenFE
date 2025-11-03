import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemesterDTO } from '../models/semester.model';
@Injectable({ providedIn: 'root' })
export class SemesterService {
    private apiUrl = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }
    getAllSemesters(): Observable<any> {
        return this.http.get(`${this.apiUrl}semester/getAll`);
    }
    findByIsOpenTrue(): Observable<SemesterDTO[]> {
        return this.http.get<SemesterDTO[]>(`${this.apiUrl}semester/Open`);
    }
}