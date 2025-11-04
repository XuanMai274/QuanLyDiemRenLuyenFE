import { ClassModel } from './class.model';
import { AccountModel } from './account.model';
import { ConductFormDTO } from './conductForm.model';

export interface StudentModel {
    studentId: number;
    fullname: string;
    gender: string;
    email: string;
    phoneNumber: string;
    status: string;
    isClassMonitor: boolean;

    classDTO?: ClassModel;
    accountDTO?: AccountModel;
    conductFormDTO?: ConductFormDTO;
}
