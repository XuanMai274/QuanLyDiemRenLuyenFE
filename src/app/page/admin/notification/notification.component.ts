import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationModel } from '../../../models/notification.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../service/notificationService';
import { EditorModule } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-notification',
  imports: [CommonModule, ReactiveFormsModule, EditorModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  notifications: NotificationModel[] = [];
  form: FormGroup;

  showForm = false;
  showDetail = false;
  isEdit = false;

  // selected sẽ chứa thêm 2 trường readableStartDate & readableEndDate
  selected: (NotificationModel & {
    readableStartDate?: string;
    readableEndDate?: string;
  }) | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      title: [''],
      content: [''],
      type: [''],
      status: [''],
      startDate: [''],
      endDate: ['']
    });

    this.getAllNotifications();
  }

  /** Format cho input type=datetime-local */
  formatDateTimeLocal(date: string | Date) {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** Format để hiển thị đẹp */
  formatReadable(date: string | Date) {
    const d = new Date(date);
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /** Load dữ liệu */
  getAllNotifications() {
    this.notificationService.getAllNotifications().subscribe({
      next: (res) => {
        this.notifications = res;
      },
      error: (err) => console.error(err)
    });
  }

  /** Mở popup thêm */
  openAddForm() {
    this.isEdit = false;
    this.form.reset();
    this.showForm = true;
  }

  /** Xem chi tiết */
  openDetail(item: NotificationModel) {
    this.selected = {
      ...item,
      readableStartDate: this.formatReadable(item.startDate),
      readableEndDate: this.formatReadable(item.endDate)
    };
    this.showDetail = true;
  }

  closeDetail() {
    this.showDetail = false;
  }

  /** Mở form sửa */
  openEditForm(item: NotificationModel) {
    this.isEdit = true;
    this.selected = item;

    this.form.patchValue({
      title: item.title,
      content: item.content,
      type: item.type,
      status: item.status,
      startDate: this.formatDateTimeLocal(item.startDate),
      endDate: this.formatDateTimeLocal(item.endDate),
    });

    this.showForm = true;
  }

  /** Đóng form thêm/sửa */
  closeForm() {
    this.showForm = false;
    this.isEdit = false;
  }

  /** Submit thêm hoặc sửa */
  submit() {
    const data = this.form.value;

    if (this.isEdit && this.selected) {
      data.notificationId = this.selected.notificationId;
      data.updateAt = new Date();
      data.createAt = this.selected.createAt;
      data.managerEntity = this.selected.managerEntity;

      this.notificationService.updateNotification(data).subscribe({
        next: () => {
          // Cập nhật vào UI
          const index = this.notifications.findIndex(n => n.notificationId === data.notificationId);
          if (index !== -1) {
            this.notifications[index] = { ...this.notifications[index], ...data };
          }
          this.closeForm();
        }
      });

    } else {
      // Thêm mới
      data.createAt = new Date();
      data.updateAt = new Date();

      this.notificationService.addNotification(data).subscribe({
        next: (res) => {
          this.notifications.push(res);
          this.closeForm();
        }
      });
    }
  }
}
