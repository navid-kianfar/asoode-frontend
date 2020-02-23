import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IdentityService } from '../services/auth/identity.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly identityService: IdentityService,
    private readonly router: Router
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const hasAccess = this.identityService && this.identityService.identity.token;
    if (hasAccess) { return true; }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

}
