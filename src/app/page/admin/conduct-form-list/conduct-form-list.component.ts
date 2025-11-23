import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassModel } from '../../../models/class.model';
import { SemesterDTO } from '../../../models/semester.model';
import { ConductFormDTO } from '../../../models/conductForm.model';
import { ConductFormService } from '../../../service/conductFormService';
import { ClassService } from '../../../service/classService';
import { SemesterService } from '../../../service/semesterService';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConductFormDetailDTO } from '../../../models/conductFormDetail.model';

@Component({
  selector: 'app-conduct-form-list',
  templateUrl: './conduct-form-list.component.html',
  styleUrls: ['./conduct-form-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ConductFormListComponent implements OnInit {
  selectedImageUrl: string | null = null;
  // ===== DỮ LIỆU CHO SELECT =====
  semesters: SemesterDTO[] = [];
  classes: ClassModel[] = [];

  selectedSemesterId: number | null = null;
  selectedClassId: number | null = null;

  // ===== DANH SÁCH PHIẾU RÈN LUYỆN =====
  conductForms: ConductFormDTO[] = [];

  constructor(
    private conductFormService: ConductFormService,
    private classService: ClassService,
    private semesterService: SemesterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSemesters();
    this.loadClasses();
  }

  // ===== LOAD HỌC KỲ & LỚP =====
  loadSemesters() {
    this.semesterService.getAllSemesters().subscribe(res => this.semesters = res);
  }

  loadClasses() {
    this.classService.getAllClass().subscribe(res => this.classes = res);
  }

  // ===== LOAD PHIẾU RÈN LUYỆN THEO LỚP + HỌC KỲ =====
  loadConductForms() {
    if (!this.selectedClassId || !this.selectedSemesterId) {
      this.conductForms = [];
      return;
    }

    this.conductFormService
      .getConductFormsByClassAndSemester(this.selectedClassId, this.selectedSemesterId)
      .subscribe(res => this.conductForms = res);
  }

  // ===== CHUYỂN SANG CHI TIẾT =====
  viewFormDetails(form: ConductFormDTO) {
    // Chuyển sang trang chi tiết với conductFormId
    this.router.navigate(['manager/conductFormDetail/', form.conductFormId]);
  }
  onFileSelected(event: any, detail: ConductFormDetailDTO) {
    const file: File = event.target.files[0];
    if (!file) return;

    detail.file = file;
    detail.fileChanged = true;        // QUAN TRỌNG
    detail.previewUrl = null;
    detail.fileName = null;

    const lower = file.name.toLowerCase();
    if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      const reader = new FileReader();
      reader.onload = () => detail.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    } else {
      detail.fileName = file.name;
    }

    event.target.value = '';
  }

}
