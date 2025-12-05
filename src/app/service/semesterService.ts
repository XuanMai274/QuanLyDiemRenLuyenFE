import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SemesterDTO } from '../models/semester.model';
@Injectable({ providedIn: 'root' })
export class SemesterService {
    private apiUrl = 'http://localhost:8080/';
    constructor(private http: HttpClient) { }
    // lấy lên tất cả học kì
    getAllSemesters(): Observable<any> {
        return this.http.get(`${this.apiUrl}semester/getAll`);
    }
    findByIsOpenTrue(): Observable<SemesterDTO[]> {
        return this.http.get<SemesterDTO[]>(`${this.apiUrl}semester/Open`);
    }
    // lấy lên danh sách học kì đã từng mở
    getAllOpenedSemesters(): Observable<SemesterDTO[]> {
        return this.http.get<SemesterDTO[]>(`${this.apiUrl}manager/semester/opened`);
    }
    // hàm cập nhật học kì đang mở
    CreateBatch(semester: SemesterDTO): Observable<SemesterDTO> {
        return this.http.post<SemesterDTO>(`${this.apiUrl}manager/createBatch`, semester);
    }
    // hàm lấy lên học kì chưa mở
    availableSemesters(): Observable<SemesterDTO[]> {
        return this.http.get<SemesterDTO[]>(`${this.apiUrl}manager/semester/available`);
    }
    //hàm cập nhật học kì
    updateSemester(semester: SemesterDTO): Observable<SemesterDTO> {
        return this.http.post<SemesterDTO>(`${this.apiUrl}manager/semester/update`, semester);
    }
    // hàm thêm mới học kì
    addSemester(semester: SemesterDTO): Observable<SemesterDTO> {
        return this.http.post<SemesterDTO>(`${this.apiUrl}manager/semester/add`, semester);
    }
}