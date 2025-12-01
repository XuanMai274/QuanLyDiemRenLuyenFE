import { ManagerModel } from "./manager.model";

export interface NotificationModel {
    notificationId: number;
    title: string;
    content: string;
    type: string;
    status: string;
    startDate: Date;
    endDate: Date;
    createAt: Date;
    updateAt: Date;
    managerEntity: ManagerModel;
    read: boolean;
}