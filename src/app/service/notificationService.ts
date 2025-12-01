import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationModel } from '../models/notification.model';
@Injectable({ providedIn: 'root' })
export class NotificationService {
    private apiUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) { }
    getAllNotifications(): Observable<NotificationModel[]> {
        return this.http.get<NotificationModel[]>(`${this.apiUrl}/manager/notification/getAll`);
    }
    addNotification(notification: NotificationModel): Observable<NotificationModel> {
        return this.http.post<NotificationModel>(`${this.apiUrl}/manager/notification/add`, notification);
    }
    updateNotification(notification: NotificationModel): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/manager/notification/update`, notification);
    }
    getAllStudentNotifications(): Observable<NotificationModel[]> {
        return this.http.get<NotificationModel[]>(`${this.apiUrl}/notification/getAll`);
    }
    markAsRead(notificationId: number) {
        return this.http.post(`${this.apiUrl}/student/notification/read/${notificationId}`, {});
    }
}