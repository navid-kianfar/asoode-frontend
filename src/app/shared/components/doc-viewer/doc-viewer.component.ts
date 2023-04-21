import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import { StringHelpers } from 'src/app/shared/helpers/string.helpers';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss'],
})
export class DocViewerComponent implements OnInit, AfterViewInit {
  @Input() path: string;
  @Input() width?: number;
  @Input() height?: number;
  safePath: any;
  loaded: boolean;

  constructor(
    public sanitizer: DomSanitizer,
    private readonly ref: ElementRef
  ) {
  }

  ngAfterViewInit() {
    if (this.ref.nativeElement.parentElement.classList.contains('modal-body')) {
      const rect = this.ref.nativeElement.parentElement.parentElement.getBoundingClientRect();
      if (!this.width) { this.width = Math.ceil(rect.width) - 60; }
      if (!this.height) { this.height = Math.ceil(rect.height); }
    }

    const scaled = `${this.path}?width=${this.width || 800}&height=${this.height || 600}`;
    const encoded = StringHelpers.base64encode(scaled);
    const url = `${environment.office_endpoint}/document/viewer/${encoded}`;
    this.safePath = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    setTimeout(() => this.loaded = true, 500);
  }

  ngOnInit() {
  }
}
