import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StatisticalService } from '../../../service/statisticalService';
import { FacultyModel } from '../../../models/faculty.model';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ClassAverageDTO } from '../../../models/ClassAverageDTO';



@Component({
  selector: 'app-average-class-score',
  standalone: true,
  imports: [FormsModule, CommonModule, NgChartsModule],
  templateUrl: './average-class-score.component.html',
  styleUrls: ['./average-class-score.component.css']
})
export class AverageClassScoreComponent implements OnInit {

  faculties: FacultyModel[] = [];
  selectedFaculty: number | null = null;
  classAverages: ClassAverageDTO[] = [];
  // Dữ liệu biểu đồ
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      {
        label: 'Điểm trung bình',
        data: [],
        backgroundColor: '#95bacf',
        borderWidth: 1,
        categoryPercentage: 0.5,
        barPercentage: 0.5
      }
    ]
  };
  barChartType: 'bar' = 'bar';
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: { beginAtZero: true, max: 100 }
    }
  };

  constructor(private statisticalService: StatisticalService) { }

  ngOnInit(): void {
    this.loadFaculties();
  }

  /** Lấy danh sách khoa */
  loadFaculties() {
    this.statisticalService.getFaculties().subscribe(res => this.faculties = res);
  }

  /** Khi chọn khoa -> lấy điểm trung bình theo lớp */
  onFacultyChange() {
    if (!this.selectedFaculty) {
      this.clearChart();
      return;
    }

    this.statisticalService.getAverageScoreByFaculty(this.selectedFaculty)
      .subscribe((res: ClassAverageDTO[]) => {
        this.classAverages = res;
        this.barChartLabels = res.map(r => r.className);
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [
            {
              label: 'Điểm trung bình',
              data: res.map(r => r.averageScore),
              backgroundColor: '#95bacf'
            }
          ]
        };
      }, err => {
        console.error('Lỗi khi lấy dữ liệu:', err);
        this.clearChart();
      });
  }

  /** Xóa dữ liệu biểu đồ */
  clearChart() {
    this.barChartLabels = [];
    this.barChartData = {
      labels: [],
      datasets: [
        {
          label: 'Điểm trung bình',
          data: [],
          backgroundColor: '#95bacf'
        }
      ]
    };
  }
}
