import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConductFormDTO } from '../../../models/conductForm.model';
import { ConductFormService } from '../../../service/conductFormService';
import { CriteriaTypeDTO } from '../../../models/criteriaType.model';
import { CriteriaTypeService } from '../../../service/criteriaTypeService';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import { ConductFormDetailDTO } from '../../../models/conductFormDetail.model';
@Component({
  selector: 'app-conduct-form-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './conduct-form-detail.component.html',
  styleUrl: './conduct-form-detail.component.css'
})
export class ConductFormDetailComponent {
  form: ConductFormDTO = {
    conductFormDetailList: [],
    classMonitorScore: 0,
    staffScore: 0,
    status: 'PENDING'
  };
  selectedImageUrl: string | null = null;
  criteriaTypeList: CriteriaTypeDTO[] = [];
  loading = false;

  /** Map để bind dữ liệu theo criteriaId */
  detailMap: { [criteriaId: number]: any } = {};

  constructor(
    private route: ActivatedRoute,
    private conductFormService: ConductFormService,
    private criteriaTypeService: CriteriaTypeService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadConductForm(+id);
  }

  loadConductForm(id: number) {
    this.loading = true;
    this.conductFormService.getConductFormById(id).subscribe({
      next: (data) => {
        this.form = data.conductForm;

        this.criteriaTypeService.getAllCriteriaGrouped().subscribe({
          next: (types: CriteriaTypeDTO[]) => {
            this.criteriaTypeList = types;
            this.mapDetails();
            this.loading = false;
          },
          error: () => {
            this.loading = false;
            Swal.fire('Lỗi', 'Không tải được danh sách tiêu chí', 'error');
          }
        });
      },
      error: () => {
        this.loading = false;
        Swal.fire('Lỗi', 'Không tải được phiếu rèn luyện', 'error');
      }
    });
  }

  mapDetails() {
    this.detailMap = Object.fromEntries(
      (this.form.conductFormDetailList || []).map((d: ConductFormDetailDTO) => {
        const criteriaId = d.criteria?.criteriaId;
        if (!criteriaId) return [null, null] as any;

        // RESET HOÀN TOÀN MỖI KHI LOAD
        d.fileChanged = false;
        d.existingFileUrl = null;
        d.previewUrl = null;
        d.fileName = null;

        // Nếu backend trả về file dạng string (URL cũ)
        if (d.file && typeof d.file === 'string') {
          d.existingFileUrl = d.file as string;
          d.file = null;

          const url = d.existingFileUrl.toLowerCase();
          if (url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
            d.previewUrl = d.existingFileUrl;
          } else {
            const parts = d.existingFileUrl.split('/');
            d.fileName = parts[parts.length - 1];
          }
        }

        // Nếu là file mới đã chọn trước đó (chưa submit)
        else if (d.file instanceof File) {
          d.fileChanged = true; // giữ lại nếu đang có file mới
          // previewUrl đã được set ở onFileSelected
          if (!d.file.type.startsWith('image/')) {
            d.fileName = d.file.name;
          }
        }

        return [criteriaId, d] as [number, ConductFormDetailDTO];
      }).filter(([id]) => id != null)
    );
  }
  onFileSelected(event: any, detail: ConductFormDetailDTO) {
    // if (!this.isStaffEditable()) return;
    const file: File = event.target.files[0];
    if (!file) return;

    detail.file = file;
    detail.fileChanged = true;
    detail.previewUrl = null;
    detail.fileName = null;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => (detail.previewUrl = reader.result as string);
      reader.readAsDataURL(file);
    } else {
      detail.fileName = file.name;
    }

    event.target.value = '';
  }
  // Lấy URL hiển thị file hoặc ảnh
  getFileUrl(criteriaId: number): string {
    const detail = this.detailMap[criteriaId];
    if (!detail) return '#';

    if (detail.previewUrl) return detail.previewUrl;
    if (detail.existingFileUrl) return detail.existingFileUrl;
    if (detail.fileName) return detail.fileName;

    return '#';
  }

  // Khi click vào ảnh để xem to
  openImagePreview(url: string) {
    console.log('Preview URL:', url);
    if (!url) {
      Swal.fire('Lỗi', 'Không có ảnh để xem chi tiết!', 'error');
      return;
    }
    this.selectedImageUrl = url;
  }


  closeImagePreview() {
    this.selectedImageUrl = null;
  }

  getDetail(criteriaId: number) {
    return this.detailMap[criteriaId];
  }

  // /** Chỉ cho phép sửa điểm quản lý */
  // isStaffEditable(): boolean {
  //   return this.form.status === 'PENDING';
  // }

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

  /** Gửi điểm quản lý */
  submit() {
    // if (!this.isStaffEditable()) return;

    this.loading = true;
    this.form.conductFormDetailList = Object.values(this.detailMap);
    this.form.staffScore = this.calculateStaffTotal();
    this.conductFormService.updateStaffScore(this.form).subscribe({
      next: () => {
        Swal.fire('Thành công', 'Cập nhật điểm quản lý thành công!', 'success');
        this.loading = false;
        if (this.form.conductFormId) {
          this.loadConductForm(this.form.conductFormId);
        }
      },
      error: () => {
        Swal.fire('Lỗi', 'Cập nhật điểm quản lý thất bại!', 'error');
        this.loading = false;
      }
    });
  }
  /** Tổng điểm tự đánh giá (studentScore) */
  calculateSelfTotal(): number {
    return Object.values(this.detailMap).reduce(
      (sum, detail) => sum + (Number(detail.selfScore) || 0),
      0
    );
  }

  /** Tổng điểm lớp trưởng (classMonitorScore) */
  calculateClassMonitorTotal(): number {
    return Object.values(this.detailMap).reduce(
      (sum, detail) => sum + (Number(detail.classMonitorScore) || 0),
      0
    );
  }

  /** Tổng điểm quản lý (staffScore) */
  calculateStaffTotal(): number {
    return Object.values(this.detailMap).reduce(
      (sum, detail) => sum + (Number(detail.staffScore) || 0),
      0
    );
  }

}
