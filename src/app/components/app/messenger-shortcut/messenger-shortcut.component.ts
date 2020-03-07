import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-messenger-shortcut',
  templateUrl: './messenger-shortcut.component.html',
  styleUrls: ['./messenger-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MessengerShortcutComponent implements OnInit {

  constructor(private readonly router: Router) { }

  ngOnInit() {
  }

  open() {
    this.router.navigateByUrl('messenger');
  }
}
