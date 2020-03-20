import { Directive, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Directive({
  selector: '[appReloadOnParamsChanged]',
})
export class ReloadOnParamsChangedDirective implements OnDestroy {
  subscriber: any;
  constructor(
    readonly activatedRoute: ActivatedRoute,
    readonly router: Router,
  ) {
    this.subscriber = this.activatedRoute.params.subscribe((params = {}) => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => {
        return false;
      };
    });
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }
}
