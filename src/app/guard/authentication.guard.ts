import {Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../views/login/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService){

    }
    
    canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean
    {
        if(this.loginService.isUserLoggedIn()) {
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}