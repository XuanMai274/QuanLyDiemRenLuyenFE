import { Component } from '@angular/core';
import { ManagerModel } from '../../../../models/manager.model';
import { UserService } from '../../../../service/userService';
@Component({
  selector: 'app-manager-navbar',
  imports: [],
  templateUrl: './manager-navbar.component.html',
  styleUrl: './manager-navbar.component.css'
})
export class ManagerNavbarComponent {
  currentManager: ManagerModel | null = null;
  constructor(private userService: UserService) { }
  ngOnInit(): void {
    this.getUser();
  }
  getUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log(data);
        this.currentManager = data as ManagerModel;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
