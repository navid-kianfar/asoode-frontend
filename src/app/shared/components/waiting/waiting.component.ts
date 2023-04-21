import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WaitingComponent {
  @Input() cssClass: string;
}
