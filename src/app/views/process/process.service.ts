import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProjectRequestWrapper } from '../project/projectRequestWrapper';
import { OCRConfReqRespWrapper } from './OCRConfReqRespWrap';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  public angularBaseUrl = environment.angularBaseUrl;
  public apiURLGetProjectListByUser = environment.remoteAPIBaseUrl + '/project/user/'; //project/create
  public apiURLCreateProject = environment.remoteAPIBaseUrl + '/project/create/';

  public apiURLProjectFileLayoutData = environment.remoteAPIBaseUrl + '/layout/layout/'; 
  public apiURLProjectFileLayoutDataInit = environment.remoteAPIBaseUrl + '/files/layout/'; 
  public remoteApiImageUrl = environment.remoteAPIBaseUrl + '/files/image/';
  public remoteApiUploadImageUrl = environment.remoteAPIBaseUrl + '/files/upload/';
  public getOcrConfDataURL = environment.remoteAPIBaseUrl + '/ocr_configuartion/user/'; 
  public updateOcrConfDataURL = environment.remoteAPIBaseUrl + '/ocr_configuartion/'; 
  public updateOcrCorePipelineURL = environment.remoteAPIBaseUrl + '/ocr-core/pipeline_json'; 
  public getOcrOutputDataURL = environment.remoteAPIBaseUrl + '/layout/document/'; 
  public getOcrOutputFileDataURL = environment.remoteAPIBaseUrl + '/files/file/'; 
  public getOcrOutputPathDataURL = environment.remoteAPIBaseUrl + '/files/file/url/'; 
  public autoNoiseOCRCoreURL = environment.remoteAPIBaseUrl + '/ocr-core/auto_noise'; 
  public base64ImageOCRCoreURL = environment.remoteAPIBaseUrl + '/ocr-core/pipeline_plugin'; 

  //public remoteTemplateBaseURL = "http://ocr.apurbatech.com:9852/";
  //public remoteTemplateBaseURL = "https://documentreader.live.mygov.bd/dr-core/";
  //public remoteTemplateBaseURL = "https://mydocreader.gov.bd/dr-core/";
  public remoteTemplateBaseURL = environment.remoteTemplateBaseURL;

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient){}

  public getProjectFileLayoutDataInit(projectId : string, fileName: string): Observable<any> {
    let remoteURL = this.apiURLProjectFileLayoutDataInit + projectId + '/'+fileName;
    console.log('LayoutLoadUrlInit: '+remoteURL);
    return this.http.get<any>(`${remoteURL}`);
  }

  public getProjectFileLayoutData(projectId : string, fileName: string): Observable<any> {
    let remoteURL = this.apiURLProjectFileLayoutData + projectId + '/'+fileName;
    console.log('LayoutLoadUrl: '+remoteURL);
    return this.http.get<any>(`${remoteURL}`);
  }

  public getOCRConfigurationData(userId : number): Observable<any> {
    let remoteURL = this.getOcrConfDataURL + userId;
    console.log('OCRConfGetURL: '+remoteURL);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.get<any>(`${remoteURL}`, {headers, observe: 'response'});
  }

  public updateOCRConfigurationData(confId : number, ocrConfData: OCRConfReqRespWrapper): Observable<any> {
    let remoteURL = this.updateOcrConfDataURL + confId;
    console.log('OCRConfUpdateURL: '+remoteURL);
    console.log(ocrConfData);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.put<any>(`${remoteURL}`, ocrConfData);
  }

  public updateBase64ImageOCRCorePipelineData(ocrConfData: OCRConfReqRespWrapper): Observable<any> {
    let remoteURL = this.updateOcrCorePipelineURL;
    console.log('OCRCorePipelineURL: '+remoteURL);
    console.log(ocrConfData);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.post<any>(`${remoteURL}`, ocrConfData, {headers, observe: 'response'});
  }

  public handleVerifyTemplateText(projectId : string, fileName: string,documentType:string): Observable<any> {
    let remoteURL = this.remoteTemplateBaseURL + 'drtv_server/';
    if(documentType == 'user') {
      remoteURL = this.remoteTemplateBaseURL + 'drtv_server/';
    } else if(documentType == 'business') {
      remoteURL = this.remoteTemplateBaseURL + 'business/';
    } else if(documentType == 'education') {
      remoteURL = this.remoteTemplateBaseURL + 'education/';
    } else if(documentType == 'land') {
      remoteURL = this.remoteTemplateBaseURL + 'land/';
    } else if(documentType == 'nothi') {
      remoteURL = this.remoteTemplateBaseURL + 'nothi/';
    }
    console.log(remoteURL);
    
    const uploadData = new FormData();
    uploadData.append('projectID', projectId);
    uploadData.append('fileName', fileName);
    uploadData.append('doctype', documentType);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    return this.http.post<any>(`${remoteURL}`, uploadData, {headers, observe: 'response'});
  }

  public handleVerifyTemplate(projectId : string, fileName: string,documentType:string): Observable<any> {
    let remoteURL = this.remoteTemplateBaseURL + 'template_validation/';
    if(documentType == 'user') {
      remoteURL = this.remoteTemplateBaseURL + 'template_validation/';
    } else if(documentType == 'business') {
      remoteURL = this.remoteTemplateBaseURL + 'business_template_validation/';
    } else if(documentType == 'education') {
      remoteURL = this.remoteTemplateBaseURL + 'education_template_validation/';
    } else if(documentType == 'land') {
      remoteURL = this.remoteTemplateBaseURL + 'land_template_validation/';
    } else if(documentType == 'nothi') {
      remoteURL = this.remoteTemplateBaseURL + 'nothi_template_validation/';
    }
    console.log(remoteURL);
    
    const uploadData = new FormData();
    uploadData.append('projectID', projectId);
    uploadData.append('fileName', fileName);
    uploadData.append('doctype', documentType);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    return this.http.post<any>(`${remoteURL}`, uploadData, {headers, observe: 'response'});
  }

  public handleExtractText(projectId : string, fileName: string,documentType:string): Observable<any> {
    let remoteURL = this.remoteTemplateBaseURL + 'extract_text/';
    
    const uploadData = new FormData();
    uploadData.append('projectID', projectId);
    uploadData.append('fileName', fileName);
    uploadData.append('doctype', documentType);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    return this.http.post<any>(`${remoteURL}`, uploadData, {headers, observe: 'response'});
  }

  public updateOCRCorePipelineData(ocrConfData: OCRConfReqRespWrapper): Observable<any> {
    let remoteURL = this.updateOcrCorePipelineURL;
    console.log('OCRCorePipelineURL: '+remoteURL);
    console.log(ocrConfData);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.post<any>(`${remoteURL}`, ocrConfData, {headers, observe: 'response'});
  }

  public handleAutoNoiseCoreOCRData(projectId: string, fileName: string, noiseType: string): Observable<Blob> {
    let remoteURL = this.autoNoiseOCRCoreURL;
    console.log('CoreOcr Auto Noise URL: '+remoteURL);
    const uploadData = new FormData();
    uploadData.append('projectID', projectId);
    uploadData.append('fileName', fileName);
    uploadData.append('noiseType', noiseType);

    console.log(uploadData);

    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Authorization':'Bearer '+localStorage.getItem("token")};
    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.post(`${remoteURL}`, uploadData, {headers, responseType: 'blob'});
  }

  public getOCROutputData(projectId : string, fileName: string, outputType: string): Observable<any> {
    let remoteURL = this.getOcrOutputDataURL + projectId+'/'+fileName+'/'+outputType;
    console.log('OCROutputURL: '+remoteURL);

    const headers = { 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'text/plain;charset=UTF-8'};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.get(`${remoteURL}`, {headers, responseType: 'text'});
  }

  public getOCRDocxputData(projectId : string, fileName: string): Observable<any> {
    let remoteURL = this.getOcrOutputDataURL + projectId+'/'+fileName+'/docx';
    console.log('OCROutputURL: '+remoteURL);

    const headers = { 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'text/plain;charset=UTF-8'};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    return this.http.get(`${remoteURL}`, {headers, responseType: 'blob'});
  }


  public generateOCRDocxputData(projectId : string, fileName: string): Observable<any> {
    let remoteURL = this.getOcrOutputDataURL + projectId+'/'+fileName+'/docx';    
    const headers = { 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'text/plain;charset=UTF-8'};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    return this.http.get(`${remoteURL}`, {headers, responseType: 'text'});
  }
  
  public getOCROutputFileData(projectId : string, fileName: string, fileType: string): Observable<any> {
    let remoteURL = this.getOcrOutputFileDataURL + projectId+'/'+fileName + '?fileType=' + fileType;
    const headers = { 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'text/plain;charset=UTF-8'};
    let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    return this.http.get(`${remoteURL}`, {headers, responseType: 'blob'});
  }

  public getOCROutputPath(projectId : string, fileName: string, outputType: string): Observable<any> {
    let remoteURL = this.getOcrOutputPathDataURL + projectId+'/'+fileName+'?fileType='+outputType;
    const headers = { 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'text/plain;charset=UTF-8'};
    return this.http.get(`${remoteURL}`, {headers, responseType: 'text'});
  }

  public createPrjectByAPI(projectWrap : ProjectRequestWrapper): Observable<HttpResponse<string>> {

    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'application/json'};
    return this.http.post<string>(`${this.apiURLProjectFileLayoutData}`, projectWrap, {headers, observe: 'response'});
  }

  uploadImageToServer(projectId: string, selectedFile: File) {

    let uploadUrl = this.remoteApiUploadImageUrl + projectId+'/image';
    const uploadData = new FormData();
    uploadData.append('file', selectedFile, selectedFile.name);

    console.log(uploadUrl);
    
    //const headers = { 'accept': '*/*','Content-Type':'multipart/form-data'};
    //const headers = { 'accept': '*/*','Content-Type':'image/png'};
    //let customHeaders = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token")});

    const headers = { 'accept': '*/*','Access-Control-Allow-Methods': 'Content-Type,Accept','Content-Type':'multipart/form-data'};

    return this.http.post<string>(`${uploadUrl}`, uploadData);
    //return this.http.post(uploadUrl, uploadData);
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

}
