import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { AdminDashboardComponent } from './page/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { StudentDashboardComponent } from './page/student/student-dashboard/student-dashboard.component';
export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        children: [
        ]
    },
    {
        path: 'manager', // url với đường dẫn admin sẽ áp dụng layout admin
        component: AdminDashboardComponent,
        children: [

        ],
        canActivate: [AuthGuard], data: { expectedRole: ['MANAGER'] }
    },
    {
        path: 'student', // url với đường dẫn admin sẽ áp dụng layout admin
        component: StudentDashboardComponent,
        children: [

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