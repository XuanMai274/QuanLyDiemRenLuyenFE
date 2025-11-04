import { ClassModel } from './class.model';
import { ManagerModel } from './manager.model';

export interface FacultyModel {
    facultyId: number;
    facultyName: string;

    classList?: ClassModel[];
    managerEntityList?: ManagerModel[];
}
