import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ClassModel } from '../models/class.model';

@Injectable({ providedIn: 'root' })
export class ClassService {
    private apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) { }
    getAllClass(): Observable<ClassModel[]> {
        return this.http.get<ClassModel[]>(`${this.apiUrl}/manager/class/getAll`);
    }
    getByClassId(): Observable<ClassModel> {
        return this.http.get<ClassModel>(`${this.apiUrl}/class/getById`)
    }
}