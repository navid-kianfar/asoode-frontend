import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.component.html',
  styleUrls: ['./phone-verification.component.scss'],
})
export class PhoneVerificationComponent implements OnInit {
  @Input() hasError: boolean;
  @Input() disabled: boolean;
  @Input() cssClass: string;
  @Input() model: string;
  @Output() modelChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onKeyUp($event: KeyboardEvent, index: number) {
    const num = !isNaN(+$event.key);
    const currentNode = $event.target as any;
    const allElements = document.querySelectorAll(
      'input[maxlength="1"]',
    ) as any;
    if (num && allElements && allElements.length) {
      // @ts-ignore
      const currentIndex = [...allElements].findIndex(el =>
        currentNode.isEqualNode(el),
      );
      const targetIndex = (currentIndex + 1) % allElements.length;
      allElements[targetIndex].select();
      allElements[targetIndex].focus();
    }
    let model = '';
    (allElements || []).forEach(e => {
      model += e.value;
    });
    this.model = model;
    this.modelChange.emit(model);
  }
}
