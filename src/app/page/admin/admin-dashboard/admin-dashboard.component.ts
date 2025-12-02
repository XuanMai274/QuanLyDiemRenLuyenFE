import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../service/dashboard_service';
import { StatisticalService } from '../../../service/statisticalService';
import { SemesterDTO } from '../../../models/semester.model';
import { FacultyModel } from '../../../models/faculty.model';
import { ClassModel } from '../../../models/class.model';
import { StudentModel } from '../../../models/student.model';

// XLSX
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  semesters: SemesterDTO[] = [];
  faculties: FacultyModel[] = [];
  classes: ClassModel[] = [];

  selectedSemester: number | null = null;
  selectedFaculty: number | null = null;
  selectedClass: number | null = null;

  submitted: StudentModel[] = [];
  notSubmitted: StudentModel[] = [];

  constructor(
    private dashboardService: DashboardService,
    private statisticalService: StatisticalService
  ) { }

  ngOnInit(): void {
    this.loadSemesters();
    this.loadFaculties();
  }

  /** Load học kỳ */
  loadSemesters() {
    this.statisticalService.getSemesters().subscribe(res => this.semesters = res);
  }

  /** Load khoa */
  loadFaculties() {
    this.statisticalService.getFaculties().subscribe(res => this.faculties = res);
  }

  /** Khi chọn học kỳ hoặc khoa -> load lại lớp */
  onSemesterOrFacultyChange() {
    this.selectedClass = null; // reset lớp
    this.submitted = [];
    this.notSubmitted = [];

    if (this.selectedFaculty != null) {
      this.statisticalService.getClassesByFaculty(this.selectedFaculty)
        .subscribe(res => this.classes = res, err => {
          console.error('Lỗi khi lấy lớp:', err);
          this.classes = [];
        });
    } else {
      this.classes = [];
    }
  }

  /** Khi chọn lớp -> load kết quả thống kê */
  loadStatistics() {
    if (this.selectedClass == null || this.selectedSemester == null) return;

    this.statisticalService.getStatistical(this.selectedSemester, this.selectedClass)
      .subscribe(res => {
        this.submitted = res.submitted || [];
        this.notSubmitted = res.notSubmitted || [];
      }, err => {
        console.error('Lỗi khi lấy thống kê:', err);
        this.submitted = [];
        this.notSubmitted = [];
      });
  }

  /** Xuất danh sách Excel với tiêu đề và format đẹp */
  exportExcel(list: StudentModel[], fileName: string) {
    if (!list || list.length === 0) return;

    // Lấy học kỳ và năm học từ selectedSemester
    const semester = this.semesters.find(s => s.semesterId === this.selectedSemester);
    const semesterName = semester ? semester.semesterName : '';
    const academicYear = semester ? semester.year : '';

    // Tiêu đề
    const title = `Danh sách sinh viên ${fileName.includes('da_nop') ? 'đã nộp' : 'chưa nộp'} phiếu rèn luyện trong học kỳ ${semesterName} năm học ${academicYear}`;

    // Tạo workbook và worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Thêm tiêu đề
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: 0 }); // dòng 1
    XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 1 }); // dòng trống

    // Tạo dữ liệu bảng
    const data = list.map((st, index) => ({
      STT: index + 1,
      'Họ tên': st.fullname,
      'Lớp': st.classDTO?.className,
      Email: st.email
    }));

    // Thêm header và dữ liệu
    const headers = ['STT', 'Họ tên', 'Lớp', 'Email'];
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: 2 }); // header là dòng 3
    const rowData = data.map(item => [item.STT, item['Họ tên'], item['Lớp'], item.Email]);
    XLSX.utils.sheet_add_aoa(ws, rowData, { origin: 3 }); // dữ liệu bắt đầu từ dòng 4

    // Định dạng header: tô màu, in đậm
    const headerRange = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cell_address = { c: C, r: 2 }; // header là dòng 3 (0-index)
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      if (!ws[cell_ref]) continue;
      ws[cell_ref].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2D719A" } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        }
      };
    }

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSach');

    // Xuất file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
  }

  navigateToProcess() {
    // TODO
  }

  navigateToAverageScore() {
    // TODO
  }
}
