import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
}
