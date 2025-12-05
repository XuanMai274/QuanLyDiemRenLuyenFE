import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterDTO } from '../../../models/semester.model';
import { SemesterService } from '../../../service/semesterService';
import { SemesterDialogComponent } from '../semester-dialog/semester-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-semesters',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './semesters.component.html',
  styleUrl: './semesters.component.css'
})
export class SemestersComponent {

  semesters: SemesterDTO[] = [];
  pagedItems: any[] = [];

  page = 1;
  pageSize = 6;
  totalPages = 1;

  showPopup = false;
  popupMode: 'add' | 'edit' = 'add';
  form!: FormGroup;
  editId?: number;

  constructor(
    private semesterService: SemesterService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      semesterName: [''],
      year: [''],
      startDate: [''],
      endDate: ['']
    });
  }

  loadData() {
    this.semesterService.getAllSemesters().subscribe(res => {
      this.semesters = res;
      console.log(this.semesters);
      this.totalPages = Math.ceil(this.semesters.length / this.pageSize);
      this.updatePage();
    });
  }

  updatePage() {
    const start = (this.page - 1) * this.pageSize;
    this.pagedItems = this.semesters.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.updatePage();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.updatePage();
    }
  }

  openPopup(mode: 'add' | 'edit', sem?: SemesterDTO) {
    this.popupMode = mode;
    this.showPopup = true;

    if (mode === 'edit' && sem) {
      this.editId = sem.semesterId;
      this.form.patchValue(sem);
    } else {
      this.form.reset();
    }
  }

  closePopup() {
    this.showPopup = false;
  }

  save() {
    const data = this.form.value;

    if (this.popupMode === 'add') {
      this.semesterService.addSemester(data).subscribe(() => {
        this.closePopup();
        this.loadData();
      });
    } else {
      data.semesterId = this.editId;
      console.log("data update", data);
      this.semesterService.updateSemester(data).subscribe(() => {
        this.closePopup();
        this.loadData();
      });
    }
  }

}
