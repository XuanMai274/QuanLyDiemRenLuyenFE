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
    existingFileUrl?: string | null;    // URL file đã lưu trên server (nếu có)
    fileChanged?: boolean;              // đánh dấu có thay đổi file không
    fileDeleted?: boolean;              // đánh dấu file đã bị xóa
}
