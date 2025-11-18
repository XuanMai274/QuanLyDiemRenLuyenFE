import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemesterDTO } from '../../../models/semester.model';
import { SemesterService } from '../../../service/semesterService';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-semester-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './semester-dialog.component.html',
  styleUrls: ['./semester-dialog.component.css']
})
export class SemesterDialogComponent {

  semesters: SemesterDTO[] = [];
  showForm = false;
  isEdit = false;

  currentSemester: SemesterDTO = {
    semesterId: 0,
    semesterName: '',
    startDate: '',
    endDate: ''
  };

  constructor(private semesterService: SemesterService) { }

  ngOnInit(): void {
    this.loadSemesters();
  }

  loadSemesters() {
    this.semesterService.getAllSemesters().subscribe(res => {
      this.semesters = res;
    });
  }

  openAddForm() {
    this.showForm = true;
    this.isEdit = false;

    this.currentSemester = {
      semesterId: 0,
      semesterName: '',
      startDate: '',
      endDate: ''
    };
  }

  openEditForm(item: SemesterDTO) {
    this.showForm = true;
    this.isEdit = true;

    // Convert ngày để input date hiểu được
    this.currentSemester = {
      ...item,
      startDate: item.startDate,
      endDate: item.endDate
    };
  }

  saveSemester() {
    if (this.isEdit) {

      const payload = {
        ...this.currentSemester,
        startDate: this.currentSemester.startDate + 'T00:00:00',
        endDate: this.currentSemester.endDate + 'T23:59:59'
      };

      this.semesterService.updateSemester(payload).subscribe(() => {
        this.loadSemesters();
        this.showForm = false;
      });

    } else {

      const payload = {
        ...this.currentSemester,
        startDate: this.currentSemester.startDate + 'T00:00:00',
        endDate: this.currentSemester.endDate + 'T23:59:59'
      };

      this.semesterService.addSemester(payload).subscribe(() => {
        this.loadSemesters();
        this.showForm = false;
      });
    }
  }

  cancel() {
    this.showForm = false;
  }
}
