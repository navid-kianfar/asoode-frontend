import { Component } from '@angular/core';

@Component({
  selector: 'app-no-api-found',
  templateUrl: './no-api-found.component.html',
  styleUrls: ['./no-api-found.component.scss']
})
export class NoApiFoundComponent {

  refresh() {
    window.location.reload();
  }
}
