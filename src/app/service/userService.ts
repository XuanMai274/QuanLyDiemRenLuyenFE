import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudentModel } from '../models/student.model';
import { ManagerModel } from '../models/manager.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }
    getCurrentUser(): Observable<any> {
        return this.http.get(`${this.apiUrl}user`);
    }
}

