import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-channel-files',
  templateUrl: './channel-files.component.html',
  styleUrls: ['./channel-files.component.scss'],
})
export class ChannelFilesComponent implements OnInit {
  @Output() hide = new EventEmitter<void>();

  ngOnInit() {}
}
