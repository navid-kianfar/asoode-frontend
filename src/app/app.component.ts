import { Component } from '@angular/core';
import { AppInitializerProvider } from './services/app.initializer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(readonly appInitializerProvider: AppInitializerProvider) {
    const loader = document.getElementById('app-loading-container');
    document.body.removeChild(loader);
  }
}
