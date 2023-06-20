import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectResponseWrapper } from './projectResponseWrapper';
import { ProjectRequestWrapper } from './projectRequestWrapper';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public angularBaseUrl = environment.angularBaseUrl;
  public apiURLGetProjectListByUser = environment.remoteAPIBaseUrl + '/project/user/'; //project/create
  public apiURLCreateProject = environment.remoteAPIBaseUrl + '/project/create/';

  public apiURLGetFilesByProject = environment.remoteAPIBaseUrl + '/files/image/'; 
  public remoteApiImageUrl = environment.remoteAPIBaseUrl + '/files/image/';
  public remoteApiUploadImageUrl = environment.remoteAPIBaseUrl + '/files/upload/';
  public remoteApiUploadImageV2Url = environment.remoteAPIBaseUrl + '/files/upload_v2/';
  //public remoteApiUploadImageDRUrl = environment.remoteAPIBaseUrl + '/files/upload_dr/';
  public remoteApiUploadImageDRUrl = environment.remoteAPIFileUploadBaseUrl + '/upload_dr/';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient){}

  
  public getProjectListByUser(userId : number): Observable<ProjectResponseWrapper[]> {
    return this.http.get<ProjectResponseWrapper[]>(`${this.apiURLGetProjectListByUser}${userId}`);
  }

  public getFileListByProject(projectId : string): Observable<string[]> {

    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    let customHeaders = new HttpHeaders({ 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'application/json'});
    const requestOptions = { headers: customHeaders };

    return this.http.get<string[]>(`${this.apiURLGetFilesByProject}${projectId}`, requestOptions);
  }

  public createPrjectByAPI(projectWrap : ProjectRequestWrapper): Observable<HttpResponse<string>> {

    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'application/json'};
    return this.http.post<string>(`${this.apiURLCreateProject}`, projectWrap, {headers, observe: 'response'});
  }

  uploadImageToServer(projectId: string, selectedFile: File) {

    let uploadUrl = this.remoteApiUploadImageDRUrl + projectId+'/image';
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('applyNoiseRemoval', "0");
    uploadData.append('token', localStorage.getItem("token"));

    console.log(uploadUrl);
    
    //const headers = { 'accept': '*/*','Content-Type':'multipart/form-data'};
    //const headers = { 'accept': '*/*','Content-Type':'image/png'};
    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    //const headers = { 'accept': '*/*','Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};
    const headers = { 'x-Trigger': 'CORS','Accept': '*/*', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};

    return this.http.post<string[]>(`${uploadUrl}`, uploadData);
    //return this.http.post<string>(`${uploadUrl}`, uploadData, {headers, observe: 'response'});
    //return this.http.post(uploadUrl, uploadData);
  }

  uploadPdfToServer(projectId: string, selectedFile: File) {

    //let uploadUrl = this.remoteApiUploadImageUrl + projectId+'/pdf';
    let uploadUrl = this.remoteApiUploadImageDRUrl + projectId+'/pdf';
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('applyNoiseRemoval', "0");
    uploadData.append('token', localStorage.getItem("token"));

    console.log(uploadUrl);
    
    //const headers = { 'accept': '*/*','Content-Type':'multipart/form-data'};
    //const headers = { 'accept': '*/*','Content-Type':'image/png'};
    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    const headers = { 'accept': '*/*','Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};

    return this.http.post<string>(`${uploadUrl}`, uploadData);
    //return this.http.post(uploadUrl, uploadData);
  }

  updateImageToServer(projectId: string, fileName: string, frmData: FormData) {

    let updateUrl = this.remoteApiUploadImageUrl + projectId+'/image?fileName='+fileName;
    //console.log(frmData);
    console.log(updateUrl);

    const headers = { 'accept': '*/*','Content-Type':'multipart/form-data'};
    //const headers = { 'accept': '*/*','Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};
    return this.http.put(`${updateUrl}`, frmData, {headers, observe: 'response'});
  }

  updateImageFileToServer(projectId: string, fileName: string, selectedFile: File) {

    //let updateUrl = this.remoteApiUploadImageUrl + projectId+'/image?fileName='+fileName;
    let updateUrl = this.remoteApiUploadImageDRUrl + projectId +'/base64image';
    //let updateUrl = 'http://localhost:8080/files/upload/1/base64image';
    //const uploadData = new FormData();
    //uploadData.append('fileName', 'lp1');
    //uploadData.append('file', selectedFile, selectedFile.name);
    //console.log(updateUrl);
    //console.log(uploadData);
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);
    uploadData.append('fileName', fileName);
    //const headers = { 'accept': '*/*','Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};
    //const headers = { 'accept': '*/*','Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};
    return this.http.put<string[]>(`${updateUrl}`, uploadData);
  }

  //curl -X PUT "http://ocr-dev.apurbatech.com:9001/upload/3/image?fileName=Screenshot2020-10-17at12.09.11AM" -H 
  // "accept: */*" -H  "Content-Type: multipart/form-data"
  // -F "file=@Screenshot 2021-04-01 at 11.26.47 PM.png;type=image/png"


  getImageAsBlob(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

}
