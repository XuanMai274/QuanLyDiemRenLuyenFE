import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CriteriaTypeDTO } from '../models/criteriaType.model';

@Injectable({ providedIn: 'root' })
export class CriteriaTypeService {
    private apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) { }
    getAllCriteriaTypes(): Observable<any> {
        return this.http.get(`${this.apiUrl}/criteriaType/getAll`);
    }
    getAllCriteriaGrouped(): Observable<CriteriaTypeDTO[]> {
        return this.http.get<CriteriaTypeDTO[]>(`${this.apiUrl}/criteriaType/getAll`);
    }
    createCriteriaType(criteriaType: CriteriaTypeDTO): Observable<CriteriaTypeDTO> {
        return this.http.post<CriteriaTypeDTO>(`${this.apiUrl}/manager/criteriaType/create`, criteriaType);
    }
    updateCriteriaType(criteriaType: CriteriaTypeDTO): Observable<CriteriaTypeDTO> {
        return this.http.post<CriteriaTypeDTO>(`${this.apiUrl}/manager/criteriaType/update`, criteriaType);
    }
}