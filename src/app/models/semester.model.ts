import { Timestamp } from "rxjs";

export interface SemesterDTO {
    semesterId: number;
    semesterName?: string;
    year?: string;
    isOpen?: boolean;
    evaluationStartDate?: String;
    evaluationEndDate?: String;
    startDate?: String;
    endDate?: String;
}
