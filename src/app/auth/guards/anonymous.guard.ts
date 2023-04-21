import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { IdentityService } from '../services/identity.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {
  constructor(
    private readonly identityService: IdentityService,
    private readonly router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const isAnonymous =
      !this.identityService.identity || !this.identityService.identity.token;
    if (isAnonymous) {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }
}
