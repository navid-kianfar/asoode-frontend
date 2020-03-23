import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SearchResultViewModel } from '../../../view-models/general/search-types';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Output() hide = new EventEmitter<any>();
  @Input() results: SearchResultViewModel;
  @Input() loading: boolean;
  @Input() term: string;

  constructor() {}

  ngOnInit() {}
}
