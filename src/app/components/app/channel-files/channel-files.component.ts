import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MockService } from '../../../services/mock.service';

@Component({
  selector: 'app-channel-files',
  templateUrl: './channel-files.component.html',
  styleUrls: ['./channel-files.component.scss'],
})
export class ChannelFilesComponent implements OnInit {
  @Output() hide = new EventEmitter<void>();
  constructor(readonly mockService: MockService) {}

  ngOnInit() {}
}
