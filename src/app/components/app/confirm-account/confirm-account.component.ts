import {Component, Input, OnInit} from '@angular/core';
import {ValidationService} from '../../../services/core/validation.service';

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {

  @Input() username: string;
  isEmail: boolean;

  constructor() {
    this.isEmail = ValidationService.isEmail(this.username);
  }

  ngOnInit() {
  }

}
