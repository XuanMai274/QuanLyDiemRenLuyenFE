import { ConductFormDTO } from "./conductForm.model";
import { ManagerModel } from "./manager.model";
import { StudentModel } from "./student.model";

export interface FeedbackDTO {
    feedbackId: number;
    studentDTO: StudentModel;
    conductFormDTO: ConductFormDTO;
    managerDTO: ManagerModel;
    content: string;
    image: string;
    gmail: string;
    responseContent: string;
    createAt: string;
    updatedDate: string;
    response: boolean;
}
// Model nội bộ dùng trong modal để gửi lên backend
export interface FeedbackModel {
    content: string;
    files: File[];
}