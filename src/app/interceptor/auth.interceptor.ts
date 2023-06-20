import { Injectable } from "@angular/core";

import{ HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { LoginService } from "../views/login/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router, private loginService: LoginService){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        if(request.url.includes(`${this.loginService.apiServerUrl}/login-url`)) {
            return next.handle(request);
        }
        const requestClone = request.clone({setHeaders: {Authorization: `Bearer ${this.loginService.getTokenFromCache()}`}});

        return next.handle(requestClone);
    }
}