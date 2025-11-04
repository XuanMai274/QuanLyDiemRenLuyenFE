import { Component } from '@angular/core';
import { UserService } from '../../../../service/userService';
import { StudentModel } from '../../../../models/student.model';
@Component({
  selector: 'app-student-navbar',
  imports: [],
  templateUrl: './student-navbar.component.html',
  styleUrl: './student-navbar.component.css'
})
export class StudentNavbarComponent {
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
        console.log(data);
        this.currentStudent = data as StudentModel;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
