import { SemesterDTO } from "./semester.model";

export interface StudentVsClassDTO {
    semesterName: SemesterDTO;
    studentScore: number;
    classAverage: number;
}