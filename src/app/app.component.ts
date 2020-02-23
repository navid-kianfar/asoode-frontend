import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loaded: boolean;

  constructor() {
    this.removeWaitingFrame();
  }

  private removeWaitingFrame() {
    const loader = document.getElementById('app-loading-container');
    document.body.removeChild(loader);
    this.loaded = true;
  }
}
