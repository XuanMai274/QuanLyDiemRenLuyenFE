import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StatisticalService {

    private baseUrl = 'http://localhost:8080';

    constructor(private http: HttpClient) { }

    getSemesters(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/semester/getAll`);
    }

    getFaculties(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/faculty/findAll`);
    }

    getClassesByFaculty(facultyId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/class/faculty/${facultyId}`);
    }

    getStatistical(semesterId: number, classId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/manager/statistical/${semesterId}/${classId}`);
    }
    getAverageScoreByFaculty(facultyId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/manager/statistical/avgClass/${facultyId}`);
    }
}
