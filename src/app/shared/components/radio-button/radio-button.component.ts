import {Component, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent implements OnInit {
  @Input() valueField: string = 'value';
  @Input() textField: string = '';
  @Input() disabled?: boolean = false;
  @Input() model: any;
  @Output() modelChange = new EventEmitter<any>();
  @Input() items: any[] = [];
  @Output() itemsChange = new EventEmitter<any[]>();
  @Input() template?: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

  pick(radio: any, $event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.disabled) { return; }
    this.model = radio[this.valueField];
    this.modelChange.emit(this.model);
  }
}
