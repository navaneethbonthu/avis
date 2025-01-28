import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
declare var $: any;
@Component({
  selector: 'app-dash-board',
  imports: [ButtonModule],
  standalone: true,
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss'
})
export default class DashBoardComponent {
  ngOnInit() {
    
  }
}
