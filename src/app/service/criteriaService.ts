import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CriteriaDTO } from '../models/criteria.model';
import { CriteriaTypeDTO } from '../models/criteriaType.model';

@Injectable({ providedIn: 'root' })
export class CriteriaService {
    private apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) { }
    getAllCriteria(): Observable<CriteriaDTO[]> {
        return this.http.get<CriteriaDTO[]>(`${this.apiUrl}/criteria/getAll`);
    }
    getAllCriteriaGrouped(): Observable<CriteriaTypeDTO[]> {
        return this.http.get<CriteriaTypeDTO[]>(`${this.apiUrl}/criteriaType/getAll`);
    }
}