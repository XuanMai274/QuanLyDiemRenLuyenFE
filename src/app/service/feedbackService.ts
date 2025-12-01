import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackDTO, FeedbackModel } from '../models/feedback.model';
import { ConductFormDTO } from '../models/conductForm.model';
@Injectable({ providedIn: 'root' })
export class FeedbackService {
    private apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) { }
    getAllFeedbacks(): Observable<FeedbackDTO[]> {
        return this.http.get<FeedbackDTO[]>(`${this.apiUrl}/feedback/getAll`);
    }
    createFeedback(
        content: string,
        conductForm: ConductFormDTO,
        file?: File | null
    ): Observable<FeedbackDTO> {
        // 1. Tạo object feedbackDTO
        const feedbackDTO = {
            content: content,
            conductFormDTO: conductForm
            // có thể thêm các field khác nếu cần
        };

        // 2. Tạo FormData
        const formData = new FormData();
        formData.append("feedbackDTO", JSON.stringify(feedbackDTO));

        // 3. Gửi file nếu có
        if (file) {
            formData.append("file", file);
        }

        // 4. POST request
        return this.http.post<FeedbackDTO>(
            `${this.apiUrl}/student/feedback/create`,
            formData
        );
    }

    updateFeedback(feedback: FeedbackDTO): Observable<FeedbackDTO> {
        return this.http.post<FeedbackDTO>(`${this.apiUrl}/student/feedback/update`, feedback);
    }
    getFeedbacks(): Observable<FeedbackDTO[]> {
    return this.http.get<FeedbackDTO[]>(`${this.apiUrl}/student/feedback/findAll`);
  }
}