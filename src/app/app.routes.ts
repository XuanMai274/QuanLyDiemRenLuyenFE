import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './page/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { StudentDashboardComponent } from './page/student/student-dashboard/student-dashboard.component';
import { ManagerComponent } from './layout/manager/manager.component';
import { StudentComponent } from './layout/student/student.component';
import { ConductFormComponent } from './page/student/conduct-form-component/conduct-form-component.component';
import { ListConductFormComponent } from './page/student/list-conduct-form-component/list-conduct-form-component.component';
import { CreateBatchComponent } from './page/admin/create-batch/create-batch.component';
import { SemestersComponent } from './page/admin/semesters/semesters.component';
import { NotificationComponent } from './page/admin/notification/notification.component';
import { NotificationStudentComponent } from './page/student/notification/notification.component';
import { CriteriaComponent } from './page/admin/criteria/criteria.component';
import { ConductFormListComponent } from './page/admin/conduct-form-list/conduct-form-list.component';
import { ConductFormDetailComponent } from './page/admin/conduct-form-detail/conduct-form-detail.component';
import { FeedbackComponent } from './page/student/feedback/feedback.component';
import { ResponseFeedbackComponent } from './page/admin/response-feedback/response-feedback.component';
import { AverageClassScoreComponent } from './page/admin/average-class-score/average-class-score.component';
export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        children: [
        ]
    },
    {

        path: 'manager', // url với đường dẫn admin sẽ áp dụng layout admin
        component: ManagerComponent,
        children: [
            {
                path: 'home', component: AdminDashboardComponent
            },
            {
                path: 'tao-dot-ren-luyen', component: CreateBatchComponent
            },
            {
                path: 'quan-ly-hoc-ki', component: SemestersComponent
            },
            {
                path: 'quan-ly-thong-bao', component: NotificationComponent
            },
            {
                path: 'quan-ly-tieu-chi', component: CriteriaComponent
            },
            {
                path: 'duyet-diem', component: ConductFormListComponent
            },
            {
                path: 'conductFormDetail/:id', component: ConductFormDetailComponent
            },
            {
                path: 'phan-hoi', component: ResponseFeedbackComponent
            },
            {
                path: 'thi-dua', component: AverageClassScoreComponent
            },

        ],
        canActivate: [AuthGuard], data: { expectedRole: ['MANAGER'] }
    },
    {
        path: 'student', // url với đường dẫn admin sẽ áp dụng layout admin
        component: StudentComponent,
        children: [

            {
                path: 'home', component: StudentDashboardComponent
            },
            {
                path: 'ConductForm/create/:semesterId', component: ConductFormComponent
            },
            {
                path: 'ConductForm/All', component: ListConductFormComponent
            },
            {
                path: 'ConductForm/:id', component: ConductFormComponent
            },
            {
                path: 'thong-bao', component: NotificationStudentComponent
            },
            {
                path: 'ho-tro', component: FeedbackComponent
            }
        ],
        canActivate: [AuthGuard], data: { expectedRole: ['STUDENT', 'CLASS_MONITOR'] }
    },
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }