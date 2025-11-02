import { Component } from '@angular/core';
import { DashboardService } from '../../../service/dashboard_service';
@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  constructor(private dashboardService: DashboardService) { }
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
