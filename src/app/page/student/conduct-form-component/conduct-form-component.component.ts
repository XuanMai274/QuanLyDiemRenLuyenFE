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
import { SemesterService } from '../../../service/semesterService';
import { SemesterDTO } from '../../../models/semester.model';
import Swal from 'sweetalert2';
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
  semesterId!: number;
  semesters: SemesterDTO[] = [];

  selectedImageUrl: string | null = null;
  loading = false;
  criteriaTypeList: CriteriaTypeDTO[] = [];

  /** Dùng Map để bind dữ liệu ổn định */
  detailMap: { [criteriaId: number]: ConductFormDetailDTO } = {};

  constructor(
    private route: ActivatedRoute,
    private criteriaService: CriteriaService,
    private conductFormService: ConductFormService,
    private criteriaTypeService: CriteriaTypeService,
    private semesterService: SemesterService
  ) { }

  ngOnInit(): void {
    this.findAllSemesters()
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode = 'edit';
      this.loadConductForm(+id);
    } else {
      this.mode = 'create';
      this.loadCriteria();
    }
    // Lấy giá trị semesterId từ URL
    this.route.paramMap.subscribe(params => {
      const id = params.get('semesterId');
      if (id) {
        this.semesterId = +id; // chuyển sang number
        console.log('Semester ID nhận được:', this.semesterId);

        // Nếu danh sách học kỳ đã load thì gán luôn
        this.selectSemesterIfLoaded();

        // Hoặc nếu load từ API => gọi hàm loadSemesters()
      }
    });
  }
  // viết hàm lấy lên tất cả học kì từ cơ sở dữ liệu
  findAllSemesters() {
    this.semesterService.getAllSemesters().subscribe({
      next: (data) => {
        this.semesters = data;
        console.log('Danh sách học kỳ:', data);
        // Khi danh sách đã tải xong, kiểm tra xem URL có semesterId không, nếu có thì chọn học kỳ tương ứng
        if (this.semesterId) {
          this.selectSemesterIfLoaded();
        }
      },
      error: (err) => console.error('Lỗi khi tải học kỳ', err)
    });
  }
  selectSemesterIfLoaded() {
    const selected = this.semesters.find(s => s.semesterId === this.semesterId);
    if (selected) {
      this.form.semester = selected;
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
        // load học kì 
        this.semesterId = data.conductForm.semester?.semesterId!;
        this.findAllSemesters();
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

  // mapDetails() {
  //   const asString = (v: any): string | null => {
  //     if (!v && v !== '') return null;
  //     if (typeof v === 'string') return v;
  //     return null;
  //   };

  //   this.detailMap = Object.fromEntries(
  //     (this.form.conductFormDetailList || [])
  //       .map((d: ConductFormDetailDTO) => {
  //         const criteriaId = d.criteria?.criteriaId ?? null;
  //         if (criteriaId === null) return [null, null];

  //         const fileStr = asString(d.file);

  //         if (fileStr) {
  //           const lower = fileStr.toLowerCase();

  //           if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
  //             d.previewUrl = fileStr;
  //             d.fileName = null;
  //           } else {
  //             const parts = fileStr.split('/');
  //             d.fileName = parts.length ? parts[parts.length - 1] : fileStr;
  //             d.previewUrl = null;
  //           }
  //         }

  //         return [criteriaId, d];
  //       })
  //       .filter(([id]) => id !== null && id !== undefined)
  //   );
  // }
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
  // lấy đường dẫn file
  getFileUrl(criteriaId: number): string {
    const detail = this.detailMap[criteriaId];
    if (detail?.existingFileUrl) return detail.existingFileUrl;
    if (detail?.file && typeof detail.file === 'string') return detail.file;
    return '#';
  }
  /** Xử lý file mới chọn (ảnh / pdf / word) */
  // onFileSelected(event: any, detail: ConductFormDetailDTO) {
  //   if (!this.isEditable()) return;

  //   const file: File = event.target.files[0];
  //   if (!file) return;

  //   detail.file = file;
  //   detail.previewUrl = null;
  //   detail.fileName = null;

  //   const lower = file.name.toLowerCase();

  //   if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
  //     const reader = new FileReader();
  //     reader.onload = () => (detail.previewUrl = reader.result as string);
  //     reader.readAsDataURL(file);
  //   } else {
  //     detail.fileName = file.name;
  //   }
  // }
  onFileSelected(event: any, detail: ConductFormDetailDTO) {
    if (!this.isEditable()) return;
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

  // removeImage(detail: ConductFormDetailDTO) {
  //   if (!this.isEditable()) return;
  //   detail.file = null;
  //   detail.previewUrl = null;
  //   detail.fileName = null;
  // }
  removeImage(detail: ConductFormDetailDTO) {
    if (!this.isEditable()) return;

    detail.file = null;
    detail.previewUrl = null;
    detail.fileName = null;
    detail.fileChanged = true;
    detail.fileDeleted = true;
    // KHÔNG ĐƯỢC XÓA existingFileUrl → phải giữ lại để backend biết có file cũ cần xóa
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
  // submit() {
  //   if (!this.isEditable()) return;

  //   if (!this.form.semester || !this.form.semester.semesterId) {
  //     alert('Chọn học kỳ trước khi gửi');
  //     return;
  //   }

  //   this.loading = true;
  //   this.form.totalStudentScore = this.calculateOverallTotal();

  //   // Cập nhật lại list từ map trước khi gửi
  //   this.form.conductFormDetailList = Object.values(this.detailMap);

  //   const obs =
  //     this.mode === 'create'
  //       ? this.conductFormService.createConductForm(this.form)
  //       : this.conductFormService.updateConductForm(this.form);

  //   obs.subscribe({
  //     next: () => {
  //       alert(
  //         this.mode === 'create'
  //           ? 'Tạo phiếu rèn luyện thành công!'
  //           : 'Cập nhật phiếu rèn luyện thành công!'
  //       );
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       alert('Có lỗi xảy ra khi gửi dữ liệu!');
  //       this.loading = false;
  //       console.error(err);
  //     },
  //   });
  // }
  submit() {
    if (!this.isEditable()) return;

    if (!this.form.semester?.semesterId) {
      Swal.fire('Cảnh báo', 'Vui lòng chọn học kỳ trước khi gửi!', 'warning');
      return;
    }

    this.loading = true;
    this.form.totalStudentScore = this.calculateOverallTotal();
    this.form.conductFormDetailList = Object.values(this.detailMap);

    const observable = this.mode === 'create'
      ? this.conductFormService.createConductForm(this.form)
      : this.conductFormService.updateConductForm(this.form, this.form.conductFormId!);

    observable.subscribe({
      next: (response: any) => {
        // HIỂN THỊ THÔNG BÁąpi ĐẸP BẰNG SWEETALERT2
        Swal.fire({
          icon: 'success',
          title: this.mode === 'create' ? 'Tạo thành công!' : 'Cập nhật thành công!',
          text: 'Phiếu rèn luyện đã được lưu thành công.',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
          background: '#d4edda',
          color: '#155724'
        });

        // Nếu là tạo mới → lấy ID mới từ response
        if (this.mode === 'create' && response?.conductForm?.conductFormId) {
          this.form.conductFormId = response.conductForm.conductFormId;
          this.mode = 'edit';
        }
        if (this.form.conductFormId) {
          this.loadConductForm(this.form.conductFormId);
        }

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Lỗi khi gửi phiếu rèn luyện:', err);

        // Thông báo lỗi đẹp
        Swal.fire({
          icon: 'error',
          title: 'Thất bại!',
          text: err.error?.message || 'Đã xảy ra lỗi khi gửi phiếu. Vui lòng thử lại!',
          confirmButtonText: 'Đóng'
        });

        this.loading = false;
      }
    });
  }
}
