import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  @Input() poster: string;
  @Input() title: string;
  @Input() src: string;
  @Input() autoplay: boolean;
  @Input() preload: boolean;

  @ViewChild('#player', { static: true }) player: HTMLVideoElement;
  constructor() {}

  ngOnInit(): void {}

  pause() {
    this.player.pause();
  }
}
