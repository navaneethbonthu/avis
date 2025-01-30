import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,HeaderComponent, SideMenuComponent,FooterComponent],
  templateUrl: './layout.component.html'
})
export default class LayoutComponent {

}
