import { Component } from '@angular/core';
import { ManagerNavbarComponent } from '../../share/component/manager/manager-navbar/manager-navbar.component';
import { ManagerSidebarComponent } from '../../share/component/manager/manager-sidebar/manager-sidebar.component';
import { ManagerFooterComponent } from '../../share/component/manager/manager-footer/manager-footer.component';
import { RouterModule } from '@angular/router';
import { Renderer2, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-manager',
  imports: [
    RouterModule,
    ManagerNavbarComponent,
    ManagerSidebarComponent,
    ManagerFooterComponent
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {

}
