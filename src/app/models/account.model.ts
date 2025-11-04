import { RoleModel } from './role.model';
import { StudentModel } from './student.model';
import { ManagerModel } from './manager.model';

export interface AccountModel {
    accountId: number;
    username: string;
    password: string;
    enable: boolean;

    roleEntity?: RoleModel;
    studentEntity?: StudentModel;
    managerEntity?: ManagerModel;
}
