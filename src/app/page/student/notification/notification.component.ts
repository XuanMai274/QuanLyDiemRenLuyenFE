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
  filteredNotifications: NotificationModel[] = [];
  showDetail: boolean = false;
  selected: NotificationModel | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 5;
  totalPages = 1;

  // Filter
  filterType: 'newest' | 'oldest' | 'all' = 'newest';

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getAllNotifications();
  }

  /** Lấy danh sách thông báo từ server */
  getAllNotifications(): void {
    this.notificationService.getAllStudentNotifications().subscribe({
      next: (res: NotificationModel[]) => {
        // Sắp xếp mặc định: mới nhất
        this.notifications = res.map(n => ({
          ...n,
          readableStartDate: this.formatDate(n.startDate),
          readableEndDate: this.formatDate(n.endDate),
          readableCreateAt: this.formatDate(n.createAt)
        }));
        this.applyFilter(); // áp dụng filter và phân trang
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  /** Áp dụng filter và phân trang */
  applyFilter(): void {
    let temp = [...this.notifications];

    if (this.filterType === 'newest') {
      temp.sort((a, b) => new Date(b.createAt).getTime() - new Date(a.createAt).getTime());
      temp = temp.slice(0, 10);
    } else if (this.filterType === 'oldest') {
      temp.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
      temp = temp.slice(0, 10);
    }

    this.totalPages = Math.ceil(temp.length / this.pageSize);
    this.currentPage = 1;
    this.filteredNotifications = temp.slice(0, this.pageSize);
  }

  /** Chuyển trang */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredNotifications = this.notifications.slice(start, end);
  }

  /** Thay đổi filter */
  setFilter(type: 'newest' | 'oldest' | 'all'): void {
    this.filterType = type;
    this.applyFilter();
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
    } as any;

    // Nếu chưa đọc, gọi API mark-as-read
    if (!item.read) {
      this.notificationService.markAsRead(item.notificationId).subscribe(() => {
        item.read = true; // cập nhật trạng thái trên UI
      });
    }

    this.showDetail = true;
  }


  /** Đóng popup */
  closeDetail(): void {
    this.showDetail = false;
    this.selected = null;
  }

}
