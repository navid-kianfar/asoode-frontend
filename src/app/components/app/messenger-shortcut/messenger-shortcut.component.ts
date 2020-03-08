import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messenger-shortcut',
  templateUrl: './messenger-shortcut.component.html',
  styleUrls: ['./messenger-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessengerShortcutComponent implements OnInit {
  @Input() dashboard: boolean;
  showMessages: boolean;

  constructor(private readonly router: Router) {}

  ngOnInit() {}

  open() {
    if (this.dashboard) {
      this.showMessages = true;
      return;
    }
    this.router.navigateByUrl('/messenger');
  }

  hide() {
    this.showMessages = false;
  }

  goToMessenger() {
    this.showMessages = false;
    this.router.navigateByUrl('/messenger');
  }
}
