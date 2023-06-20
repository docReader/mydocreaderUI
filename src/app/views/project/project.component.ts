import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentWrapper } from './DocumentWrapper';
import { DOCUMENT  } from '@angular/common';
import { Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ProjectService } from './project.service';
import { ProjectResponseWrapper } from './projectResponseWrapper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: 'project.component.html',
   styles:['.btn {flex: 0;}.btn-primary{background-color:#35304C;}']
})
export class ProjectComponent implements OnInit {
  
  @Inject(DOCUMENT) private document: Document;
  documentList: DocumentWrapper[];
   
  private subscriptions = new SubSink();
  public documentPath: string;
  public documentDir: string;
  public documentId:string;
  public projectId : string;
  public showLoading: boolean;
  public errorMessage: string;
  public hasError: boolean;
  public remoteApiImageUrl: string;
  public imgPathTmp : string;
  defaultImage = 'https://miro.medium.com/max/441/1*9EBHIOzhE1XfMYoKz1JcsQ.gif';
  errorImage = 'https://i.imgur.com/QsFAQso.jpg';
  image = 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg';
  image$:Promise<any>;
  imageToShow: any;
  selectedFile: File;
  public uploadedFileName: string;
  messagebody: any;

  constructor(private route: ActivatedRoute, protected router: Router,  private projectService: ProjectService, private sanitizer: DomSanitizer){
    this.documentDir = '/assets/documents/';
    console.log('In Process Constructor');
    this.documentPath = this.documentDir + '230.png';

    this.image$ = this.loadImage(this.image);
  }

  loadImage(src:string) {
    return new Promise((resolve, reject) => {
      resolve(src);
    });
  }

  ngOnInit(): void {
    this.showLoading = false;
    this.documentList = [];
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.errorMessage = '';
    this.uploadedFileName = '';
    this.hasError = false;

    this.imgPathTmp = 'https://ocr-dev.apurbatech.com:9090/files/image/3/Screenshot2020-10-17at12.09.11AM';
    
    this.remoteApiImageUrl = this.projectService.remoteApiImageUrl;

    console.log('project on init id: '+this.projectId);
    //this.documentList.push(new DocumentWrapper('230','DocumentOne','','230.png', this.documentDir + '230.png'));
    //this.documentList.push(new DocumentWrapper('232','DocumentTwo','','232.png', this.documentDir + '232.png'));
    //this.documentList.push(new DocumentWrapper('233','DocumentThree','','233.png', this.documentDir +'233.png'));
    console.log('project init done');

    this.loadProjectWiseFileList();
    //this.getImageFromService();
  }

  loadProjectWiseFileList() {
    this.showLoading = true;
    let imagePath = '';
    this.documentList = [];
    this.subscriptions.add (
      this.projectService.getFileListByProject(this.projectId).subscribe(
        (responseArray: string[]) => {
          console.log(responseArray);
          if(responseArray.length===0){
           this.messagebody = "No files have been uploaded"
          }
          for (var fileName of responseArray) {
            imagePath = this.remoteApiImageUrl+this.projectId+'/'+fileName+'?width=150&height=120';

            console.log(fileName +'\nPath: '+imagePath); 

            this.documentList.push(new DocumentWrapper(fileName,fileName,'',fileName, imagePath, this.projectId));
          }
          this.showLoading = false;
          this.errorMessage = '';
          this.hasError = false;
        },
        (error: HttpErrorResponse) => {
          //alert(error.message);
          console.log(error.message);
          // this.errorMessage = 'No files available for this project. Please add one. '+error.message;
          this.errorMessage = 'No files available for this project. Please add one.';
          this.showLoading = false;
          this.hasError = true;
        }
      ) );
  }

  sanitize(url: string) {
    //return url;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
    this.uploadedFileName = this.selectedFile.name;
    console.log('image selected');
    this.handleImageUpload();
    if(this.selectedFile!=null){
      if( this.selectedFile.type == 'application/pdf' || this.selectedFile.type == 'image/png' || this.selectedFile.type == 'image/jpg' || this.selectedFile.type == 'image/jpeg' ){
        this.hasError = false;
        this.errorMessage = '';
      }else {
        this.hasError = true;
        this.errorMessage = 'Please select png/jpg/jpeg/pdf file.';
      }
    }
  }

  handleImageUpload(){
    console.log('image upload process');
    console.log(this.selectedFile);
    this.hasError = false;
    if(this.selectedFile!=null){
      this.showLoading = true;
      if(this.selectedFile.type == 'application/pdf'){
        console.log('Uploading pdf');
        this.projectService.uploadPdfToServer(this.projectId, this.selectedFile).subscribe(
          (response) => {
            console.log(response);
            this.showLoading = false;
            this.uploadedFileName = '';
            this.errorMessage = '';
            this.hasError = false;
            this.loadProjectWiseFileList();
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            //alert(error.message);
            this.errorMessage = error.message;
            this.showLoading = false;
            this.hasError = true;
            this.uploadedFileName = '';

            //There was a CORS policy error so the error is commented. 
            /*this.showLoading = false;
            this.uploadedFileName = '';
            this.errorMessage = '';
            this.hasError = false;
            this.loadProjectWiseFileList();*/
          }
        );
      } else if(this.selectedFile.type == 'image/png' || this.selectedFile.type == 'image/jpg' || this.selectedFile.type == 'image/jpeg') {
        console.log('Uploading png or jpg or jpeg');
        this.projectService.uploadImageToServer(this.projectId, this.selectedFile).subscribe(
          (response) => {
            console.log(response);
            this.showLoading = false;
            this.loadProjectWiseFileList();
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            //alert(error.message);
            this.errorMessage = error.error[0];
            this.showLoading = false;
            this.hasError = true;
            
             //There was a CORS policy error so the error is commented. 
             /*this.showLoading = false;
             this.uploadedFileName = '';
             this.errorMessage = '';
             this.hasError = false;
             this.loadProjectWiseFileList();*/
          }
        );

      } else {
        this.hasError = true;
        this.errorMessage = 'Please upload png/jpg/jpeg/pdf file.';
        this.showLoading = false;
        alert('Please upload png/jpg/jpeg/pdf file.');
      }
    } else {
      this.hasError = true;
      this.errorMessage = 'Please select a file';
      alert('Please select file');
    }
  }

  refresh(docId: string){
    let targetUrl = '/process-mydoc/'+docId;

    this.router.navigate([targetUrl]);
  }
}
