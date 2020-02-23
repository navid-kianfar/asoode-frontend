import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {IdentityService} from './auth/identity.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly identityService: IdentityService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: { Authorization: this.identityService.identity.token || '' },
    });
    return (
      next
        .handle(request)
        // add error handling
        .pipe(
          catchError((error: any, caught: Observable<HttpEvent<any>>) => {
            if (error.status === 401) {
              this.identityService.logout();
              this.router.navigateByUrl('/login');
              // if you've caught / handled the error, you don't
              // want to rethrow it unless you also want
              // downstream consumers to have to handle it as
              // well.
              return of(error);
            }
            throw error;
          }),
        )
    );
  }
}
