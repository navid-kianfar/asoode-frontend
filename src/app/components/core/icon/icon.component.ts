import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements OnInit {
  constructor() {}
  @Input() name: ImageNames;
  @Input() cssClass: string;
  @Input() width: string;
  @Input() height: string;

  ngOnInit() {
    this.width = this.width || '50pt';
    this.height = this.height || '50pt';
  }
}
type ImageNames =
  | 'back'
  | 'forward'
  | 'logo'
  | 'calendar'
  | 'calendar-timeline'
  | 'finger-print'
  | 'earth'
  | 'chat-bubble'
  | 'google-calendar'
  | 'clock'
  | 'check'
  | 'double-check'
  | 'list-ul'
  | 'timer'
  | 'like-it'
  | 'dislike-it'
  | 'checked-checkbox'
  | 'unchecked-checkbox'
  | 'eye'
  | 'sub-organization'
  | 'eye-slash'
  | 'close'
  | 'broadcast'
  | 'transfer'
  | 'money-bag'
  | 'archive'
  | 'key'
  | 'email'
  | 'board'
  | 'users'
  | 'menu'
  | 'add-user-filled'
  | 'user'
  | 'crown'
  | 'private'
  | 'us-dollar'
  | 'headset'
  | 'settings'
  | 'left'
  | 'edit'
  | 'help'
  | 'door-sensor-alarmed'
  | 'exit'
  | 'futures'
  | 'plus-math'
  | 'home'
  | 'automation'
  | 'card-page'
  | 'card'
  | 'files'
  | 'filter'
  | 'search'
  | 'members'
  | 'search-bg'
  | 'statics-bg'
  | 'bell'
  | 'bell-slash'
  | 'table'
  | 'expand-arrow'
  | 'collapse-arrow'
  | 'dashboard'
  | 'labels'
  | 'custom-field'
  | 'card-elements'
  | 'attach'
  | 'recent'
  | 'star'
  | 'download'
  | 'import'
  | 'external-link'
  | 'geo-fence'
  | 'checklist'
  | 'block'
  | 'poll'
  | 'organization'
  | 'comment'
  | 'state'
  | 'puzzle'
  | 'address-book'
  | 'reload'
  | 'undo'
  | 'trash'
  | 'pie-chart'
  | 'statics'
  | 'toggle-on'
  | 'toggle-off'
  | 'toggle-middle'
  | 'monitor'
  | 'align-left'
  | 'arrow-left'
  | 'estimated-time'
  | 'time-slider'
  | 'calendar-check'
  | 'calendar-warn'
  | 'calendar-from'
  | 'calendar-to'
  | 'calendar-1'
  | 'calendar-2'
  | 'calendar-3'
  | 'calendar-4'
  | 'calendar-5'
  | 'calendar-6'
  | 'calendar-7'
  | 'calendar-8'
  | 'calendar-9'
  | 'calendar-10'
  | 'calendar-11'
  | 'calendar-12'
  | 'calendar-13'
  | 'calendar-14'
  | 'calendar-15'
  | 'calendar-16'
  | 'calendar-17'
  | 'calendar-18'
  | 'calendar-19'
  | 'calendar-20'
  | 'calendar-21'
  | 'calendar-22'
  | 'calendar-23'
  | 'calendar-24'
  | 'calendar-25'
  | 'calendar-26'
  | 'calendar-27'
  | 'calendar-28'
  | 'calendar-29'
  | 'calendar-30'
  | 'calendar-31';