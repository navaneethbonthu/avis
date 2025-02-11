import { Component, inject, Input, input } from '@angular/core';
import { Iuser } from '../../shared/data-access/auth';
import { AuthService } from '../../shared/data-access/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  public authService = inject(AuthService);


  currentUser = input<Iuser>();
 
}
