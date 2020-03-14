import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchService } from '../../../services/general/search.service';
import { MockService } from '../../../services/mock.service';
import { SearchResultViewModel } from '../../../view-models/general/search-types';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit {
  @Output() hide = new EventEmitter<any>();
  @Output() results: SearchResultViewModel;
  @Output() loading: any;

  constructor(
    private readonly searchService: SearchService,
    private readonly mockService: MockService,
  ) {}

  ngOnInit() {
    this.results = this.mockService.searchResult;
  }
}
