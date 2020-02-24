import { Injectable } from '@angular/core';
import {
  ModalParameters,
  PromptModalParameters,
} from '../../view-models/core/modal-types';
import { NavigationEnd, Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
import { Observable } from 'rxjs';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  modals = [];

  constructor(
    private readonly simpleModalService: SimpleModalService,
    private readonly router: Router,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.closeAll();
      }
    });
  }

  alert(options: ModalParameters): { subscribe: (result) => {} } {
    return null;
  }
  prompt(options: PromptModalParameters): { subscribe: (result) => {} } {
    return null;
  }

  confirm(options: ModalParameters): { subscribe: (result) => {} } {
    options.title = options.title || '';
    options.message = options.message || '';
    options.icon = options.icon || '';
    options.cssClass = options.cssClass || 'confirm-modal';
    options.actionLabel = options.actionLabel || 'CONFIRM';
    options.cancelLabel = options.cancelLabel || 'CANCEL';
    options.action = options.action || (() => Promise.resolve());
    options.cancel = options.cancel || (() => Promise.resolve());
    return this.show(ConfirmComponent, options);
  }

  closeAll() {
    this.modals.forEach(m => {
      try {
        m.unsubscribe();
      } catch (e) {}
    });
    this.modals.length = 0;
  }
  show<T1 = any, T2 = any>(
    component,
    data?: T1,
    options?: any,
  ): { subscribe: (result) => {} } {
    const modal = this.simpleModalService.addModal<T1, T2>(
      component,
      data || ({} as any),
      options || {},
    );
    return {
      subscribe: (handler = undefined) => {
        const r = modal.subscribe(handler);
        this.modals.push(r);
        return r;
      },
    };
  }
}
