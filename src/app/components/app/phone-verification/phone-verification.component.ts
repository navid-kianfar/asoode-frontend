import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.scss'],
})
export class PhoneVerificationComponent implements OnInit {
  prefix: string;
  @Input() hasError: boolean;
  @Input() disabled: boolean;
  @Input() cssClass: string;
  @Input() model: string;
  @Output() modelChange = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {
    this.prefix = new Date().getTime().toString();
  }

  onKeyUp($event: KeyboardEvent, index: number) {
    index++;
    if (index === 7) { index = 1; }
    const num = !isNaN(+$event.key);
    const next = document.querySelector('#verify-' + this.prefix + ' input[id="txt-' + index + '"]') as HTMLInputElement;
    if (num && next) {
      next.select();
      next.focus();
    }
    const allElements = document.querySelectorAll('#verify-' + this.prefix + ' input[maxlength="1"]');
    let model = '';
    (allElements || []).forEach(e => {
      model += e.value;
    });
    this.model = model;
    this.modelChange.emit(model);
  }
}
