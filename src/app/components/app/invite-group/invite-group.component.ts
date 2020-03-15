import { Component, OnInit } from '@angular/core';
import {MockService} from '../../../services/mock.service';
import { AccessType } from 'src/app/library/app/enums';

@Component({
  selector: 'app-invite-group',
  templateUrl: './invite-group.component.html',
  styleUrls: ['./invite-group.component.scss']
})
export class InviteGroupComponent implements OnInit {
  AccessType = AccessType;
  constructor(readonly mockService: MockService) { }

  ngOnInit() {
  }

}
