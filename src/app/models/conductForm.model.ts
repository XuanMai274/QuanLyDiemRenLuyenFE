import { ConductFormDetailDTO } from "./conductFormDetail.model";
import { SemesterDTO } from "./semester.model";
import { StudentModel } from "./student.model";

export interface ConductFormDTO {
    conductFormId?: number;
    totalStudentScore?: number;
    classMonitorScore?: number;
    staffScore?: number;
    status?: string;
    createAt?: string;
    updatedDate?: string;
    semester?: SemesterDTO;
    student?: StudentModel;
    conductFormDetailList: ConductFormDetailDTO[];
}