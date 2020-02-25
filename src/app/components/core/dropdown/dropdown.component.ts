import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
  @Input() model: any;
  @Input() cssClass: string;
  @Input() disabled: boolean;
  @Input() items: any[];

  @Output() modelChange = new EventEmitter<any>();
  @Output() itemsChange = new EventEmitter<any[]>();
  constructor() {}

  ngOnInit() {}
}
