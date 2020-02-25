import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DropdownKnownList, OperationResultStatus} from '../../../library/core/enums';
import {HttpService} from '../../../services/core/http.service';
import {ListViewModel} from '../../../view-models/core/list-types';
import {CountryService} from '../../../services/core/country.service';
import {TimezoneService} from '../../../services/core/timezone.service';
import {MatMenuTrigger} from '@angular/material';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() cssClass: 'custom-color' | string;
  @Input() disabled: boolean;
  @Input() knownList: DropdownKnownList;
  @Input() allowClear: boolean;
  @Input() choose: boolean;
  @Input() chooseLabel: string;
  @Input() enum: string;
  @Input() enumExcept: any[];
  @Input() waiting: boolean;
  @Input() ltr: boolean;
  @Input() backend: string;
  @Input() backendParams: any;
  @Input() prependIcon: string;
  @Input() model: any;
  @Input() items: ListViewModel[];

  @Output() modelChange = new EventEmitter<any>();
  @Output() itemsChange = new EventEmitter<ListViewModel[]>();
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

  showPlate: boolean;
  selectedItem: any;
  constructor(
    readonly httpService: HttpService,
    readonly countryService: CountryService,
    readonly zoneService: TimezoneService,
  ) {}

  updateItems(val) {
    this.items = val;
    this.itemsChange.emit(val);
  }

  updateModel(val) {
    this.model = val;
    this.modelChange.emit(val);
  }
  get text(): string {
    const item = (this.items || []).find(i => i.value === this.model);
    if (item) {
      return item.text;
    }
    return this.chooseLabel || 'PLEASE_CHOOSE';
  }

  closePlate() {
    this.trigger.closeMenu();
  }

  ngOnInit() {
    this.items = this.items || [];
    if (this.choose) {
      const def = {
        value: undefined,
        separator: false,
        text: this.chooseLabel || 'PLEASE_CHOOSE'
      };
      this.items.unshift(def);
      if (this.model === undefined) {
        this.onPick(def, null);
      }
    }
    if (this.knownList) {
      switch (this.knownList) {
        case DropdownKnownList.Countries:
          this.countryService.countries
            .map<ListViewModel>(c => {
              return {
                value: c.id,
                text: c.text,
              };
            })
            .forEach(c => this.items.push(c));
          break;
        case DropdownKnownList.Zones:
          this.zoneService.timezones
            .map<ListViewModel>(t => {
              return {
                value: t.value,
                text: t.text,
              };
            })
            .forEach(t => this.items.push(t));
          break;
      }
    }
    if (this.enum) {
      const items = [];
      this.enumExcept = this.enumExcept || [];
      const enumObj = (window as any).Asoode.enums[this.enum];
      Object.keys(enumObj).forEach(key => {
        const text = `ENUMS.${this.enum}.${key}`.toUpperCase();
        if (this.enumExcept.indexOf(enumObj[key]) !== -1) {
          return;
        }
        items.push({ text, separator: false, value: enumObj[key] });
      });
      this.items = items;
    }
    if (this.model && !this.selectedItem) {
      const found = this.items.find(i => i.value === this.model);
      if (found) {
        this.onPick(found, null);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.backend && this.backend) {
      this.load();
      this.selectedItem = undefined;
      if (!changes.backend.firstChange) {
        this.model = undefined;
      }
    }
  }
  async load() {
    this.disabled = true;
    const op = await this.httpService.post<ListViewModel[]>(
      this.backend,
      this.backendParams,
    );
    this.disabled = false;
    if (op.status === OperationResultStatus.Success) {
      this.updateItems(op.data);
      this.checkSelectedItem();
    }
  }

  toggle() {
    if (this.disabled) {
      return;
    }
    this.trigger.toggleMenu();
  }

  onPick(item: ListViewModel, $event: MouseEvent, trigger: boolean = false) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    if (this.disabled) {
      return;
    }
    this.selectedItem = item;
    this.trigger.closeMenu();
    if (trigger) {
      this.updateModel(item.value);
    }
  }

  compare(item: ListViewModel) {
    return this.model === item.value;
  }

  clear($event?: Event) {
    $event.stopPropagation();
    $event.preventDefault();
    this.trigger.closeMenu();
    this.selectedItem = undefined;
    this.model = undefined;
    this.modelChange.emit(undefined);
  }

  checkSelectedItem() {
    if (this.model) {
      const found = this.items.find(i => i.value === this.model);
      if (found) {
        this.onPick(found, null);
      }
    }
  }
}
