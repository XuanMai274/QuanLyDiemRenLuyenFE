import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagerModel } from '../../../../models/manager.model';
import { UserService } from '../../../../service/userService';
@Component({
  selector: 'app-manager-sidebar',
  imports: [RouterModule],
  templateUrl: './manager-sidebar.component.html',
  styleUrl: './manager-sidebar.component.css'
})
export class ManagerSidebarComponent {
  activeSubmenu: string | null = null;

  toggleSubmenu(name: string) {
    this.activeSubmenu = this.activeSubmenu === name ? null : name;
  }
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
