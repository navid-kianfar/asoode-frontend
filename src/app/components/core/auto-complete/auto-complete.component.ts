import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ListViewModel } from '../../../view-models/core/list-types';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { HttpService } from '../../../services/core/http.service';
import { fromEvent } from 'rxjs';
import { OperationResultStatus } from '../../../library/core/enums';

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent implements OnInit {
  @Input() placeHolder?: string;
  @Input() disabled: boolean;
  @Input() cssClass: string;
  @Input() readonly: boolean;
  @Input() backend: string;
  @Input() ltr: boolean;
  @Input() model: string;
  @Output() modelChange = new EventEmitter<string>();
  @Output() pick = new EventEmitter<any>();
  @Output() startModify = new EventEmitter<string>();
  isLoading: boolean;
  filtered: ListViewModel[];
  constructor(
    private readonly httpService: HttpService,
    private readonly ref: ElementRef,
  ) {}

  displayFn(value) {
    return value;
  }

  ngOnInit() {
    const input = this.ref.nativeElement.querySelectorAll('input')[0];
    fromEvent(input, 'input')
      .pipe(
        debounceTime(500),
        tap(() => {
          this.filtered = [];
          this.isLoading = true;
        }),
        switchMap((project) => {
          const search = input.value;
          this.startModify.emit(search);
          return this.httpService.post(this.backend, { search });
        }),
      )
      .subscribe((data) => {
        const search = input.value;
        this.model = search;
        this.modelChange.emit(search);
        if (data.status === OperationResultStatus.Success) {
          this.filtered = data.data as ListViewModel[];
        } else {
          this.filtered = [];
        }
        this.isLoading = false;
      });
  }

  update(item: ListViewModel) {
    this.pick.emit(item.payload);
    this.model = item.value;
    this.modelChange.emit(item.value);
  }

  hide(trigger) {
    setTimeout(() => {
      trigger.closePanel();
    }, 300);
  }
}
