import { Component } from '@angular/core';
import { ConductFormDTO } from '../../../models/conductForm.model';
import { ConductFormService } from '../../../service/conductFormService';
import { CriteriaDTO } from '../../../models/criteria.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SemesterService } from '../../../service/semesterService';
import { SemesterDTO } from '../../../models/semester.model';
@Component({
  selector: 'app-list-conduct-form-component',
  imports: [CommonModule, RouterModule],
  templateUrl: './list-conduct-form-component.component.html',
  styleUrl: './list-conduct-form-component.component.css'
})
export class ListConductFormComponent {
  constructor(
    private conductFormService: ConductFormService,
    private router: Router,
    private semesterService: SemesterService
  ) { }
  // khai báo danh sách phiếu rèn luyện
  conductForms: ConductFormDTO[] = [];
  // khai báo danh sách học kì đang mở
  openSemesters: SemesterDTO[] = [];
  // viết phương thức lấy danh sách phiếu rèn luyện từ API
  ngOnInit(): void {
    this.loadConductForms();
    this.findByIsOpenTrue();
  }
  loadConductForms() {
    this.conductFormService.findAllByStudentId().subscribe({
      next: (data: ConductFormDTO[]) => {
        this.conductForms = data;
        console.log('Danh sách phiếu rèn luyện:', data);
      },
      error: (err) => console.error('Lỗi khi tải phiếu rèn luyện', err)
    })
  }
  // hàm lấy lên danh sách học kì đang mở xét điểm rèn luyện
  findByIsOpenTrue() {
    this.semesterService.findByIsOpenTrue().subscribe({
      next: (data: SemesterDTO[]) => {
        this.openSemesters = data;
        console.log('Danh sách học kỳ mở:', data);

      }
    });
  }
  // Hàm xếp loại điểm rèn luyện
  Grade(score: number): string {
    if (score > 90) return 'Xuất sắc';
    else if (score > 80) return 'Tốt';
    else if (score > 65) return 'Khá';
    else if (score > 50) return 'Trung bình';
    else if (score === 0) return 'Đang xét duyệt';
    else return 'Yếu';
  }
  getButtonLabel(form: ConductFormDTO): string {
    switch (form.status) {
      case 'PENDING':
        return 'Xem chi tiết';
      case 'APPROVED':
        return 'Xem kết quả';
      default:
        return '';
    }
  }
  // hàm này dùng để xử lý sự kiện khi nhấn nút đánh giá hoặc xem chi tiết/kết quả

  onAction(form: ConductFormDTO): void {
    if (form.status === 'NOT_EVALUATED') {
      // Điều hướng sang /student/ConductForm/creates/{semesterId}
      this.router.navigate(['/student/ConductForm/create', form.semester?.semesterId]);
    } else {
      // Điều hướng sang /student/ConductForm/{id}
      this.router.navigate(['/student/ConductForm', form.conductFormId]);
    }
  }
  // hàm tạo mới phiếu rèn luyện
  onCreateConductForm(semesterId: number): void {
    // Chuyển hướng sang URL create theo học kỳ
    this.router.navigate(['/student/ConductForm/create', semesterId]);
  }
  getButtonClass(form: ConductFormDTO): string {
    return form.status === 'COMPLETED' ? 'btn-info' : 'btn-primary';
  }
}
