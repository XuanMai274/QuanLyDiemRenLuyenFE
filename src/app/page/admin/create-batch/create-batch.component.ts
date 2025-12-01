import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterService } from '../../../service/semesterService';
import { SemesterDTO } from '../../../models/semester.model';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-create-batch',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-batch.component.html',
  styleUrl: './create-batch.component.css'
})
export class CreateBatchComponent {
  openedSemesters: SemesterDTO[] = [];
  openSemesters: SemesterDTO[] = [];
  availableSemesters: SemesterDTO[] = [];
  selectedSemesterId?: number;
  evaluationStartDate?: string;
  evaluationEndDate?: string;

  showModal = false;
  constructor(private semesterService: SemesterService, private toastr: ToastrService) { }
  ngOnInit() {
    this.getAllOpenedSemesters();
    this.getOpenSemesters();
  }
  getAllOpenedSemesters() {
    this.semesterService.getAllOpenedSemesters().subscribe((data) => {
      console.log("Danh sách học kì đã mở", data);
      this.openedSemesters = data;
    });
  }
  getOpenSemesters() {
    this.semesterService.findByIsOpenTrue().subscribe((data) => {
      console.log("Học kì đang mở", data);
      this.openSemesters = data;
    });
  }
  openCreateModal() {
    this.showModal = true;
    this.semesterService.availableSemesters().subscribe((data) => {
      this.availableSemesters = data;
    });
  }

  closeModal() {
    this.showModal = false;
    this.selectedSemesterId = undefined;
  }
  createSemester() {
    // Tìm đối tượng học kỳ được chọn
    const selectedSemester = this.availableSemesters.find(
      s => s.semesterId === this.selectedSemesterId
    );

    if (!selectedSemester) {
      this.toastr.warning('Vui lòng chọn một học kỳ.');
      return;
    }
    selectedSemester.evaluationStartDate = this.evaluationStartDate;
    selectedSemester.evaluationEndDate = this.evaluationEndDate;

    // Gửi đối tượng lên backend
    this.semesterService.CreateBatch(selectedSemester).subscribe({
      next: () => {
        this.toastr.success('Tạo đợt rèn luyện mới thành công!');
        this.closeModal();
        this.getOpenSemesters(); // Cập nhật lại danh sách học kỳ mà không reload trang
      },
      error: () => {
        this.toastr.error('Không thể tạo đợt rèn luyện.');
      }
    });
  }
}
