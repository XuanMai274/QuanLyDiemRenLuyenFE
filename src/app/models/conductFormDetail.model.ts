import { CriteriaDTO } from "./criteria.model";

export interface ConductFormDetailDTO {
    conductFormDetailId?: number;
    selfScore?: number;
    classMonitorScore?: number;
    staffScore?: number;
    comment?: string;
    file?: File | null;       // file local (không serialize vào JSON)
    fileUrl?: string | null;  // được trả về từ backend sau upload
    tempId: string;           // UUID do frontend tạo
    previewUrl?: string | null; // URL tạm thời để hiển thị ảnh xem trước
    fileName?: string | null;   // Tên file cho PDF/Word
    criteria: CriteriaDTO;
}