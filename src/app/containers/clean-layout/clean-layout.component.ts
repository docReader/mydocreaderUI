import {Component} from '@angular/core';
import { navItems } from '../../_nav';

@Component({
  selector: 'clean-dashboard',
  templateUrl: './clean-layout.component.html'
})
export class CleanLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
