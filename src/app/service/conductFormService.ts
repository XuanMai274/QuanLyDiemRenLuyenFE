import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConductFormDTO } from '../models/conductForm.model';

@Injectable({ providedIn: 'root' })
export class ConductFormService {
    private apiUrl = 'http://localhost:8080/conductForm/create';

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
        return this.http.post(this.apiUrl, formData);
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
    updateConductForm(form: any): Observable<any> {
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
        return this.http.post(this.apiUrl, formData);
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
