import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public apiServerUrl = environment.apiBaseUrl;
 //public loginUrl = environment.accountLoginBaseUrl + '/account/login';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient){}


}
