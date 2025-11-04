import { FacultyModel } from './faculty.model';
import { AccountModel } from './account.model';
import { NotificationModel } from './notification.model';

export interface ManagerModel {
    managerId: number;
    fullname: string;
    email: string;
    phoneNumber: string;
    status: string;

    facultyEntity?: FacultyModel;
    accountEntity?: AccountModel;
    notificationEntity?: NotificationModel[];
}
