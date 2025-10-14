import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable({
    providedIn: "root"
})
export class StudentDashboardService {
    private apiUrl = 'http://localhost:8080/student';
    constructor(private http: HttpClient) { }
    getTest(): Observable<String> {
        return this.http.get<String>(this.apiUrl);
    }
}