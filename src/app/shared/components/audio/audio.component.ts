import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss'],
})
export class AudioComponent implements OnInit {
  @Input() audioUrl: string;
  @Input() title: string;
  @Input() autoPlay: boolean;
  @Input() displayTitle: boolean;
  @Input() displayVolumeControls: boolean;
  @Input() disablePositionSlider: boolean;
  @Input() expanded: boolean;
  @Output() ended = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
