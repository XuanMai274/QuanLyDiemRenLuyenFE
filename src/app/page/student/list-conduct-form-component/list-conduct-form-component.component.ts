import { Component } from '@angular/core';
import { ConductFormDTO } from '../../../models/conductForm.model';
import { ConductFormService } from '../../../service/conductFormService';
import { CriteriaDTO } from '../../../models/criteria.model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-list-conduct-form-component',
  imports: [CommonModule],
  templateUrl: './list-conduct-form-component.component.html',
  styleUrl: './list-conduct-form-component.component.css'
})
export class ListConductFormComponent {
  constructor(
    private conductFormService: ConductFormService,
  ) { }
  // khai báo danh sách phiếu rèn luyện
  conductForms: ConductFormDTO[] = [];
  // viết phương thức lấy danh sách phiếu rèn luyện từ API
  ngOnInit(): void {
    this.loadConductForms();
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
    return form.status === 'PENDING' ? 'Xem chi tiết' : 'Đánh giá';
  }

  getButtonClass(form: ConductFormDTO): string {
    return form.status === 'COMPLETED' ? 'btn-info' : 'btn-primary';
  }
}
