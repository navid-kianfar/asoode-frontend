import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
  @Input() cssClass: string;
  @Input() summary: string;
  @Input() label: string;
  @Input() disabled: boolean;
  @Input() model: boolean;
  @Output() modelChange = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit() {}
}
