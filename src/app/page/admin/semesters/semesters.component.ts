import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { SemesterDTO } from '../../../models/semester.model';
import { SemesterService } from '../../../service/semesterService';
import { SemesterDialogComponent } from '../semester-dialog/semester-dialog.component';

@Component({
  selector: 'app-semesters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './semesters.component.html',
  styleUrl: './semesters.component.css'
})
export class SemestersComponent {

  semesters: SemesterDTO[] = [];

  constructor(
    private semesterService: SemesterService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadSemesters();
  }

  loadSemesters() {
    this.semesterService.getAllSemesters().subscribe(res => {
      this.semesters = res;
      console.log(this.semesters);
    });
  }

  openAddSemester() {
    const dialogRef = this.dialog.open(SemesterDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSemesters();
    });
  }

  openEditSemester(item: SemesterDTO) {
    const dialogRef = this.dialog.open(SemesterDialogComponent, {
      width: '500px',
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadSemesters();
    });
  }
}
