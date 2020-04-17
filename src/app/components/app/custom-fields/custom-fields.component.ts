import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss'],
})
export class CustomFieldsComponent implements OnInit {
  @Input() model: any[];
  @Input() taskId: string;
  constructor() {}

  ngOnInit() {}
}
