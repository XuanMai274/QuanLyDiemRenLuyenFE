import { FacultyModel } from "./faculty.model";
import { StudentModel } from './student.model';

export interface ClassModel {
    classId: number;
    className: string;

    facultyEntity?: FacultyModel;
    studentEntityList?: StudentModel[];
}
