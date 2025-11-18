import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationModel } from '../../../models/notification.model';
import { NotificationService } from '../../../service/notificationService';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  providers: [DatePipe]
})
export class NotificationStudentComponent implements OnInit {

  notifications: NotificationModel[] = [];
  showDetail: boolean = false;
  selected: NotificationModel | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAllNotifications();
  }

  /** Lấy danh sách thông báo từ server */
  getAllNotifications(): void {
    this.notificationService.getAllStudentNotifications().subscribe({
      next: (res: NotificationModel[]) => {
        // Chuyển ngày sang định dạng dễ đọc
        this.notifications = res.map(n => ({
          ...n,
          readableStartDate: this.formatDate(n.startDate),
          readableEndDate: this.formatDate(n.endDate),
          readableCreateAt: this.formatDate(n.createAt)
        }));
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  /** Chuyển Date/ISOString sang định dạng hiển thị */
  formatDate(date: string | Date): string {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  /** Mở popup xem chi tiết */
  openDetail(item: NotificationModel): void {
    this.selected = {
      ...item,
      readableStartDate: this.formatDate(item.startDate),
      readableEndDate: this.formatDate(item.endDate),
      readableCreateAt: this.formatDate(item.createAt)
    } as any; // thêm thuộc tính đọc dễ nhìn
    this.showDetail = true;
  }

  /** Đóng popup */
  closeDetail(): void {
    this.showDetail = false;
    this.selected = null;
  }
}
