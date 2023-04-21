import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IdentityService } from '../../auth/services/identity.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptor implements HttpInterceptor {
  constructor(
    private readonly router: Router,
    private readonly identityService: IdentityService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const obj = {
      setHeaders: {
        'ngsw-bypass': 'true'
      },
    } as any;
    if (
      this.identityService.identity &&
      this.identityService.identity.token
    ) {
      Object.assign(obj.setHeaders, {
        Authorization: this.identityService.identity.token,
      });
    }

    if (request.headers.has('skip')) {
      request = request.clone({
        headers: request.headers.delete('skip'),
      });
      return next.handle(request);
    }

    request = request.clone(obj);
    return next.handle(request).pipe(
      catchError((error: any, caught: Observable<HttpEvent<any>>) => {
        if (error.status === 401) {
          setTimeout(() => this.identityService.logout(), 100)
          // TODO: fix 401
          return of(error);
        }
        throw error;
      })
    );
  }
}
