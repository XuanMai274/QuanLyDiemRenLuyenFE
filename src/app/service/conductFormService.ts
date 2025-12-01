import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConductFormDTO } from '../models/conductForm.model';
import { StudentVsClassDTO } from '../models/student_cvs_class';

@Injectable({ providedIn: 'root' })
export class ConductFormService {
    private apiUrl = 'http://localhost:8080/conductForm';

    constructor(private http: HttpClient) { }
    createConductForm(form: any): Observable<any> {
        const formData = new FormData();

        //Clone object để loại bỏ file khỏi DTO trước khi gửi
        const dtoCopy = JSON.parse(JSON.stringify(form));
        dtoCopy.conductFormDetailList = dtoCopy.conductFormDetailList.map((d: any) => {
            const { file, ...rest } = d;
            return rest;
        });

        //Thêm phần JSON chính (conductForm)
        formData.append(
            'conductForm',
            new Blob([JSON.stringify(dtoCopy)], { type: 'application/json' })
        );

        //Gom tất cả detailMeta vào 1 mảng
        const detailMetaArray = form.conductFormDetailList
            .filter((detail: any) => detail.file) // chỉ lấy detail có file
            .map((detail: any) => ({
                tempId: detail.tempId,
                criteriaId: detail.criteria.criteriaId,
            }));

        //Gửi mảng JSON 1 lần duy nhất
        if (detailMetaArray.length > 0) {
            formData.append(
                'detailMeta',
                new Blob([JSON.stringify(detailMetaArray)], { type: 'application/json' })
            );
        }

        //Gửi từng file
        form.conductFormDetailList.forEach((detail: any) => {
            if (detail.file) {
                formData.append('detailFiles', detail.file);
            }
        });

        //Không set header thủ công, để Angular tự gán multipart boundary
        return this.http.post(this.apiUrl + "/create", formData);
    }

    findAllByStudentId(): Observable<ConductFormDTO[]> {
        return this.http.get<{ success: boolean; conductForms: ConductFormDTO[] }>(
            `http://localhost:8080/conductForm/findAll`
        ).pipe(
            map(response => response.conductForms) // bóc tách mảng ra
        );
    }
    // Lấy lên chi tiết phiếu rèn luyện theo id
    getConductFormById(id: number): Observable<{ success: boolean; conductForm: ConductFormDTO }> {
        return this.http.get<{ success: boolean; conductForm: ConductFormDTO }>(
            `http://localhost:8080/conductForm/Detail/${id}`
        );

    }
    // hàm cập nhật lại phiếu rèn luyện
    updateConductForm(form: ConductFormDTO, conductFormId: number): Observable<any> {
        const formData = new FormData();

        // Tạo DTO sạch (không có file, previewUrl, fileChanged)
        const cleanDto: any = {
            conductFormId: form.conductFormId,
            semester: form.semester,
            totalStudentScore: form.totalStudentScore,
            classMonitorScore: form.classMonitorScore,
            staffScore: form.staffScore,
            status: form.status,
            createAt: form.createAt,
            student: form.student,
            conductFormDetailList: form.conductFormDetailList.map(d => {
                const { file, previewUrl, fileName, fileChanged, ...rest } = d as any;
                return {
                    ...rest,
                    existingFileUrl: d.existingFileUrl || null
                };
            })
        };

        formData.append('conductForm', new Blob([JSON.stringify(cleanDto)], { type: 'application/json' }));

        // LẤY TẤT CẢ DETAIL CÓ THAY ĐỔI
        const changedDetails = form.conductFormDetailList.filter(d => d.fileChanged === true);

        if (changedDetails.length > 0) {
            // Tạo meta array – lưu lại thứ tự chính xác
            const detailMetaArray = changedDetails.map(detail => ({
                criteriaId: detail.criteria!.criteriaId,
                tempId: detail.tempId,
                deleteOldFile: detail.fileChanged && detail.existingFileUrl != null && detail.file == null
            }));

            formData.append('detailMeta', new Blob([JSON.stringify(detailMetaArray)], { type: 'application/json' }));
            console.log("dữ liệu json của conductForm", formData.getAll('conductForm'));
            // QUAN TRỌNG NHẤT: GỬI FILE THEO ĐÚNG THỨ TỰ TRONG detailMetaArray
            // Chỉ gửi file cho những meta có file mới (deleteOldFile = false và có file)
            detailMetaArray.forEach((meta, index) => {
                const detail = changedDetails[index];
                if (detail.file instanceof File) {
                    formData.append('detailFiles', detail.file, detail.file.name);
                }
            });
        }

        return this.http.post(`http://localhost:8080/conductForm/update/${conductFormId}`, formData);
    }

    updateStaffScore(conductForm: ConductFormDTO): Observable<ConductFormDTO> {
        return this.http.post<ConductFormDTO>(`http://localhost:8080/manager/conductForm/update`, conductForm);
    }
    getConductFormsByClassAndSemester(selectedClassId: number, selectedSemesterId: number): Observable<ConductFormDTO[]> {
        return this.http.get<ConductFormDTO[]>(`http://localhost:8080/manager/conductForm/${selectedClassId}/${selectedSemesterId}`)
    }
    getConductFormByStudentId(studentId: number): Observable<ConductFormDTO> {
        return this.http.get<ConductFormDTO>(`http://localhost:8080/manager/conductForm/studentId/${studentId}`)
    }
    getLatestConductForm(): Observable<ConductFormDTO> {
        return this.http.get<ConductFormDTO>(`http://localhost:8080/student/dashboard/conductForm`)
    }
    getAllConductFormsByStudentId(): Observable<ConductFormDTO[]> {
        return this.http.get<ConductFormDTO[]>(`http://localhost:8080/student/dashboard/conductForms`)
    }
    // conductFormService.ts
    compareStudentVsClass() {
        return this.http.get<StudentVsClassDTO[]>(`http://localhost:8080/conductForm/compare/student`);
    }

    compareLatestSemester(studentId: number) {
        return this.http.get<StudentVsClassDTO>(`http://localhost:8080/conductForm/compare/student/latest`);
    }

    // createConductForm(form: any): Observable<any> {
    //     const formData = new FormData();

    //     // Clone để bỏ file trong object
    //     const dtoCopy = JSON.parse(JSON.stringify(form));
    //     dtoCopy.conductFormDetailList = dtoCopy.conductFormDetailList.map((d: any) => {
    //         const { file, ...rest } = d;
    //         return rest;
    //     });

    //     // Thêm phần JSON chính
    //     formData.append('conductForm', new Blob([JSON.stringify(dtoCopy)], { type: 'application/json' }));

    //     // Append detail files và meta
    //     form.conductFormDetailList.forEach((detail: any) => {
    //         if (detail.file) {
    //             formData.append('detailFiles', detail.file);
    //             formData.append('detailMeta', new Blob(
    //                 [JSON.stringify({
    //                     tempId: detail.tempId,
    //                     criteriaId: detail.criteriaEntity.criteriaId
    //                 })],
    //                 { type: 'application/json' }
    //             ));
    //         }
    //     });

    //     // Không set header thủ công!
    //     return this.http.post(this.apiUrl, formData);
    // }
}
function uuidv4(): any {
    throw new Error('Function not implemented.');
}

