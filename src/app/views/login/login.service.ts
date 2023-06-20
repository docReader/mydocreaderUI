import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponseWrapper } from './LoginResponseWrapper';
import { LoginRequestWrapper } from './LoginRequestWrapper';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public apiServerUrl = environment.remoteAPIBaseUrl;
  public loginUrl = environment.remoteAPIBaseUrl + '/account/login';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient){}

  
  public checkUserLoginGet(usrName: string, usrPass : string): Observable<LoginResponseWrapper> {
    return this.http.get<LoginResponseWrapper>(`${this.apiServerUrl}/login-url-get/${usrName}/${usrPass}`);
  }

  public checkUserLogin(loginReq: LoginRequestWrapper): Observable<HttpResponse<LoginResponseWrapper>> {
    
    //const headers = { 'Content-Type': 'application/json', 'accept': '*/*' };
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'application/json'};
/*
    const headerDict = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
    const requestOptions = {                                                                                                                                                                                 
          headers: new HttpHeaders(headerDict)
    };
    const headerSet = new HttpHeaders();
    headerSet.append('Access-Control-Allow-Origin', 'http://ocr-dev.apurbatech.com:9090');
    headerSet.append('Access-Control-Allow-Credentials', 'true');
    headerSet.append('Access-Control-Allow-Headers', 'Content-Type');
    headerSet.append('Content-Type', 'application/json');
*/
    return this.http.post<LoginResponseWrapper>(`${this.loginUrl}`, loginReq, {headers, observe: 'response'});
  }

  addUserToCache(loginUser: LoginResponseWrapper): void{
    localStorage.setItem('user', JSON.stringify(loginUser));
  }

  addDocTypeToCache(doctype:string): void{
    localStorage.setItem('docType',doctype);
  }
  
  getUserFromCache(): LoginResponseWrapper {
    return JSON.parse(localStorage.getItem('user'));
  }

  addUserIdToCache(userId: string): void{
    localStorage.setItem('userId', userId);
  }

  getUserIdFromCache(): string {
    return localStorage.getItem('userId');
  }

  addTokenToCache(token: string): void{
    localStorage.setItem('token', token);
  }

  getTokenFromCache(): string{
    return localStorage.getItem('token');
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  getTokenExpirationDate(): Date | null {
    return this.jwtHelper.getTokenExpirationDate(this.getTokenFromCache());
  }

  isUserLoggedIn(): boolean {
    if(this.getTokenFromCache() && this.getUserFromCache() && 
      this.jwtHelper.decodeToken(this.getTokenFromCache()).sub &&
      !this.jwtHelper.isTokenExpired(this.getTokenFromCache())  
    ) 
    {
      return true;
    } else {
      this.logOut();
      return false;
    }
  }
}
