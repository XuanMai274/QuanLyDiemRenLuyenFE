import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

import { ConductFormDTO } from '../../../models/conductForm.model';
import { ConductFormService } from '../../../service/conductFormService';
import { CriteriaService } from '../../../service/criteriaService';
import { CriteriaTypeDTO } from '../../../models/criteriaType.model';
import { CriteriaTypeService } from '../../../service/criteriaTypeService';
import { ConductFormDetailDTO } from '../../../models/conductFormDetail.model';

@Component({
  selector: 'app-conduct-form-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './conduct-form-component.component.html',
  styleUrls: ['./conduct-form-component.component.css']
})
export class ConductFormComponent implements OnInit {

  mode: 'create' | 'edit' | 'view' = 'create';
  form: ConductFormDTO = {
    conductFormDetailList: [],
    classMonitorScore: 0,
    staffScore: 0,
    status: 'PENDING'
  };

  semesters = [
    { semesterId: 1, semesterName: 'Học kỳ I 2025-2026' },
    { semesterId: 2, semesterName: 'Học kỳ II 2025-2026' },
    { semesterId: 3, semesterName: 'Học kỳ I 2026-2027' }
  ];

  selectedImageUrl: string | null = null;
  loading = false;
  criteriaTypeList: CriteriaTypeDTO[] = [];

  /** Dùng Map để bind dữ liệu ổn định */
  detailMap: { [criteriaId: number]: ConductFormDetailDTO } = {};

  constructor(
    private route: ActivatedRoute,
    private criteriaService: CriteriaService,
    private conductFormService: ConductFormService,
    private criteriaTypeService: CriteriaTypeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.loadConductForm(+id);
    } else {
      this.mode = 'create';
      this.loadCriteria();
    }
  }

  isEditable(): boolean {
    // Chỉ cho phép sửa khi status là PENDING và mode là create hoặc edit
    return (this.mode === 'create' || this.mode === 'edit')
      && this.form.status === 'PENDING';
  }

  /** Load form khi có id (edit mode) */
  loadConductForm(id: number) {
    this.loading = true;
    this.conductFormService.getConductFormById(id).subscribe({
      next: (data) => {
        console.log('Chi tiết phiếu rèn luyện:', data.conductForm);
        this.form = data.conductForm;

        // Load danh sách tiêu chí
        this.criteriaTypeService.getAllCriteriaGrouped().subscribe({
          next: (types: CriteriaTypeDTO[]) => {
            this.criteriaTypeList = types;
            this.mapDetails();
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            alert('Không tải được danh sách tiêu chí.');
          }
        });

        // Nếu trạng thái khác PENDING thì chuyển sang chế độ view
        if (this.form.status !== 'PENDING') {
          this.mode = 'view';
        }
      },
      error: (err) => {
        this.loading = false;
        alert('Không tải được phiếu rèn luyện.');
        console.error(err);
      }
    });
  }

  /** Load tiêu chí khi tạo mới */
  loadCriteria() {
    this.loading = true;
    this.criteriaService.getAllCriteriaGrouped().subscribe({
      next: (types: CriteriaTypeDTO[]) => {
        this.criteriaTypeList = types;

        this.form.conductFormDetailList = types.flatMap(type =>
          (type.criteriaEntityList ?? []).map(c => ({
            tempId: uuidv4(),
            selfScore: 0,
            classMonitorScore: 0,
            staffScore: 0,
            comment: '',
            file: null,
            fileName: null,
            previewUrl: null,
            criteria: c,
            criteriaTypeEntity: {
              criteriaTypeId: type.criteriaTypeId,
              criteriaTypeName: type.criteriaTypeName,
              maxScore: type.maxScore
            }
          }))
        );

        this.mapDetails();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        alert('Không load được danh sách tiêu chí');
      }
    });
  }

  mapDetails() {
    const asString = (v: any): string | null => {
      if (!v && v !== '') return null;
      if (typeof v === 'string') return v;
      return null;
    };

    this.detailMap = Object.fromEntries(
      (this.form.conductFormDetailList || [])
        .map((d: ConductFormDetailDTO) => {
          const criteriaId = d.criteria?.criteriaId ?? null;
          if (criteriaId === null) return [null, null];

          const fileStr = asString(d.file);

          if (fileStr) {
            const lower = fileStr.toLowerCase();

            if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
              d.previewUrl = fileStr;
              d.fileName = null;
            } else {
              const parts = fileStr.split('/');
              d.fileName = parts.length ? parts[parts.length - 1] : fileStr;
              d.previewUrl = null;
            }
          }

          return [criteriaId, d];
        })
        .filter(([id]) => id !== null && id !== undefined)
    );
  }

  /** Lấy detail đảm bảo luôn tồn tại */
  getDetail(criteriaId: number): ConductFormDetailDTO {
    if (!this.detailMap[criteriaId]) {
      this.detailMap[criteriaId] = {
        tempId: uuidv4(),
        selfScore: 0,
        classMonitorScore: 0,
        staffScore: 0,
        comment: '',
        file: null,
        fileName: null,
        previewUrl: null,
        criteria: { criteriaId } as any,
      } as ConductFormDetailDTO;
    }
    return this.detailMap[criteriaId];
  }

  /** Xử lý file mới chọn (ảnh / pdf / word) */
  onFileSelected(event: any, detail: ConductFormDetailDTO) {
    if (!this.isEditable()) return;

    const file: File = event.target.files[0];
    if (!file) return;

    detail.file = file;
    detail.previewUrl = null;
    detail.fileName = null;

    const lower = file.name.toLowerCase();

    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
      const reader = new FileReader();
      reader.onload = () => (detail.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    } else {
      detail.fileName = file.name;
    }
  }

  removeImage(detail: ConductFormDetailDTO) {
    if (!this.isEditable()) return;
    detail.file = null;
    detail.previewUrl = null;
    detail.fileName = null;
  }

  openImagePreview(url: string) { this.selectedImageUrl = url; }
  closeImagePreview() { this.selectedImageUrl = null; }

  /** Tính điểm */
  calculateTypeTotal(type: CriteriaTypeDTO): number {
    if (!type.criteriaEntityList) return 0;
    return type.criteriaEntityList.reduce(
      (sum, c) => sum + (Number(this.getDetail(c.criteriaId)?.selfScore) || 0),
      0
    );
  }

  calculateOverallTotal(): number {
    return this.criteriaTypeList.reduce(
      (sum, type) => sum + this.calculateTypeTotal(type),
      0
    );
  }

  /** Gửi form */
  submit() {
    if (!this.isEditable()) return;

    if (!this.form.semester || !this.form.semester.semesterId) {
      alert('Chọn học kỳ trước khi gửi');
      return;
    }

    this.loading = true;
    this.form.totalStudentScore = this.calculateOverallTotal();

    // Cập nhật lại list từ map trước khi gửi
    this.form.conductFormDetailList = Object.values(this.detailMap);

    const obs =
      this.mode === 'create'
        ? this.conductFormService.createConductForm(this.form)
        : this.conductFormService.updateConductForm(this.form);

    obs.subscribe({
      next: () => {
        alert(
          this.mode === 'create'
            ? 'Tạo phiếu rèn luyện thành công!'
            : 'Cập nhật phiếu rèn luyện thành công!'
        );
        this.loading = false;
      },
      error: (err) => {
        alert('Có lỗi xảy ra khi gửi dữ liệu!');
        this.loading = false;
        console.error(err);
      },
    });
  }
}
