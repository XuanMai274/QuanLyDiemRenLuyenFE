import { Component } from '@angular/core';
import { StudentDashboardService } from '../../../service/studentdashboard_service';
@Component({
  selector: 'app-student-dashboard',
  imports: [],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  constructor(private dashboardService: StudentDashboardService) { }
  onTestClick() {
    this.dashboardService.getTest().subscribe({
      next: (data) => {
        console.log('✅ Dữ liệu nhận được:', data);
      },
      error: (err) => {
        console.error('❌ Lỗi khi gọi API:', err);
      }
    });
  }
}
