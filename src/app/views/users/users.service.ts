import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SystemUserWrapper } from './SystemUserWrapper';
import { SystemUserRoleWrapper } from './SystemUserRoleWrapper';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public angularBaseUrl = environment.angularBaseUrl;
  public apiURLGetProjectListByUser = environment.remoteAPIBaseUrl + '/project/user/'; 
  public apiURLGetUserRoleList = environment.remoteAPIBaseUrl + '/project/user/'; 
  public apiURLCreateProject = environment.remoteAPIBaseUrl + '/project/create/';

  public apiURLGetFilesByProject = environment.remoteAPIBaseUrl + '/files/image/'; 
  public remoteApiImageUrl = environment.remoteAPIBaseUrl + '/files/image/';
  public remoteApiUploadImageUrl = environment.remoteAPIBaseUrl + '/files/upload/';
  public remoteApiUploadImageV2Url = environment.remoteAPIBaseUrl + '/files/upload_v2/';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient){}

  
  public getAllUserList(): Observable<SystemUserWrapper[]> {
    return this.http.get<SystemUserWrapper[]>(`${this.apiURLGetProjectListByUser}`);
  }

  public getUserRoleList(): Observable<SystemUserRoleWrapper[]> {
    return this.http.get<SystemUserRoleWrapper[]>(`${this.apiURLGetUserRoleList}`);
  }

  public getAllUserListByRole(roleName : String): Observable<SystemUserWrapper[]> {
    return this.http.get<SystemUserWrapper[]>(`${this.apiURLGetProjectListByUser}${roleName}`);
  }

  public getFileListByProject(projectId : string): Observable<string[]> {

    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    let customHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'application/json'});
    const requestOptions = { headers: customHeaders };

    return this.http.get<string[]>(`${this.apiURLGetFilesByProject}${projectId}`, requestOptions);
  }

  public createUserByAPI(projectWrap : SystemUserWrapper): Observable<HttpResponse<string>> {

    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'application/json'};
    return this.http.post<string>(`${this.apiURLCreateProject}`, projectWrap, {headers, observe: 'response'});
  }
}
