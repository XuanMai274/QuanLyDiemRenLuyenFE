import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentFooterComponent } from '../../share/component/student/student-footer/student-footer.component';
import { StudentNavbarComponent } from '../../share/component/student/student-navbar/student-navbar.component';
import { StudentSidebarComponent } from '../../share/component/student/student-sidebar/student-sidebar.component';

@Component({
  selector: 'app-student',
  imports: [RouterModule,
    StudentNavbarComponent,
    StudentSidebarComponent,
    StudentFooterComponent],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent {

}
