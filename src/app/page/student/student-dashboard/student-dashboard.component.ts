import { Component, ElementRef, ViewChild } from '@angular/core';
import { StudentDashboardService } from '../../../service/studentdashboard_service';
import { ConductFormDTO } from '../../../models/conductForm.model';
import { ConductFormService } from '../../../service/conductFormService';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);
@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css'
})
export class StudentDashboardComponent {
  constructor(private dashboardService: StudentDashboardService, private conductFormService: ConductFormService) { }
  conductForm: ConductFormDTO | null = null;
  ngOnInit(): void {
    this.conductFormService.getLatestConductForm().subscribe({
      next: (form) => {
        this.conductForm = form;
        console.log('Latest Conduct Form:', this.conductForm);
      },
      error: (error) => {
        console.error('Error fetching latest conduct form:', error);
      }
    });
    this.loadData();
    this.renderStudentPieChart();
    this.renderFacultyPieChart();
    this.loadCompareChart();
  }
  getGrade(score: number): string {
    if (score >= 90) return 'Xuất sắc';
    if (score >= 80) return 'Tốt';
    if (score >= 65) return 'Khá';
    if (score >= 50) return 'Trung bình';
    return 'Yếu';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED': return 'green';
      case 'PENDING': return 'orange';
      case 'CLASS_REVIEWED': return 'blue';
      case 'STAFF_REVIEWED': return 'purple';
      default: return 'gray';
    }
  }

  @ViewChild('barChart') barChart!: ElementRef;
  loadData() {
    this.conductFormService.getAllConductFormsByStudentId().subscribe(forms => {
      const semesters = forms.map(f =>
        `${f.semester?.semesterName ?? "HK?"} - ${f.semester?.year ?? ""}`
      );
      const staffScores = forms.map(f => f.staffScore ?? 0);

      const colors = staffScores.map(staffScore => {
        if (staffScore == null) return 'gray';
        if (staffScore < 60) return 'red';
        if (staffScore <= 80) return 'orange';
        return 'green';
      });

      const rankLabels = staffScores.map(score => this.getRank(score));

      this.renderChart(semesters, staffScores, colors, rankLabels);
    });
  }

  getRank(score: number): string {
    if (score < 60) return "Yếu";
    if (score <= 80) return "TB-Khá";
    return "Tốt";
  }
  renderChart(labels: any[], scores: number[], colors: string[], rankLabels: string[]) {
    new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Điểm cán bộ khoa đánh giá (staffScore)',
          data: scores,
          backgroundColor: colors,
          borderWidth: 1,
          categoryPercentage: 0.5,
          barPercentage: 0.5
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const score = tooltipItem.raw as number;
                return `Điểm: ${score} | Xếp loại: ${this.getRank(score)}`;
              }
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value: number, ctx: any) => {
              return rankLabels[ctx.dataIndex];
            },
            color: '#000',
            font: { weight: 'bold' }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
  @ViewChild('studentPieChart') studentPieChart!: ElementRef;
  @ViewChild('facultyPieChart') facultyPieChart!: ElementRef;
  renderStudentPieChart() {
    if (!this.conductForm) return;

    const score = this.conductForm.totalStudentScore ?? 0;
    const remaining = 100 - score;

    new Chart(this.studentPieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Điểm đạt', 'Còn thiếu'],
        datasets: [{
          data: [score, remaining],
          backgroundColor: [this.getScoreColor(score), '#E0E0E0']
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: '#000',
            font: { weight: 'bold' },
            formatter: () => `${score} / 100`
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
  renderFacultyPieChart() {
    if (!this.conductForm) return;

    const score = this.conductForm.staffScore ?? 0;
    const remaining = 100 - score;

    new Chart(this.facultyPieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Điểm đạt', 'Còn thiếu'],
        datasets: [{
          data: [score, remaining],
          backgroundColor: [this.getScoreColor(score), '#E0E0E0'],
          categoryPercentage: 0.5,
          barPercentage: 0.5
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: '#000',
            font: { weight: 'bold' },
            formatter: () => score === 0 ? 'Chưa chấm' : `${score} / 100`
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }
  getScoreColor(score: number): string {
    if (score >= 80) return 'green';
    if (score >= 65) return 'orange';
    return 'red';
  }
  @ViewChild('compareChart') compareChart!: ElementRef;

  loadCompareChart() {
    this.conductFormService.compareStudentVsClass().subscribe(data => {
      console.log("Dữ liệu so sánh điểm cá nhân và lớp:", data);
      const labels = data.map(d => `${d.semesterName.semesterName} (${d.semesterName.year})`);
      const studentScores = data.map(d => d.studentScore);
      const classAvgs = data.map(d => d.classAverage);

      new Chart(this.compareChart.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Điểm cá nhân',
              data: studentScores, backgroundColor: '#3498db',
              categoryPercentage: 1.0,
              barPercentage: 0.5
            },
            {
              label: 'Điểm trung bình lớp',
              data: classAvgs, backgroundColor: '#95a5a6',
              categoryPercentage: 1.0,
              barPercentage: 0.5
            }
          ]
        },
        options: {
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    });
  }

}
