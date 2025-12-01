import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudentModel } from '../../../../models/student.model';
import { UserService } from '../../../../service/userService';
@Component({
  selector: 'app-student-sidebar',
  imports: [RouterModule],
  templateUrl: './student-sidebar.component.html',
  styleUrl: './student-sidebar.component.css'
})
export class StudentSidebarComponent {
  currentStudent: StudentModel | null = null;
  constructor(
    private userService: UserService
  ) { }
  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log("Thông tin sinh viên hiện tại", data);
        this.currentStudent = data as StudentModel;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
