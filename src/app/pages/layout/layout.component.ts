import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/data-access/auth.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,HeaderComponent, SideMenuComponent,FooterComponent],
  templateUrl: './layout.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {

  public authService = inject(AuthService);


}


