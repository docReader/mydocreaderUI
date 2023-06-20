import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DocumentWrapper } from './DocumentWrapper';
import { DOCUMENT  } from '@angular/common';
import { Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { ProjectService } from '../project/project.service';
import { ProjectResponseWrapper } from '../project/projectResponseWrapper';
import { NgForm } from '@angular/forms';
import { UserWrapper } from "../login/UserWrapper";

@Component({
  templateUrl: 'dashboard.component.html',
  styles:['.btn {flex: 0;}.btn-primary{background-color:#35304C;}']
})
export class DashboardComponent implements OnInit {
  @ViewChild('myModalClose') modalClose;
   
   documentList: DocumentWrapper[];
   projectList: ProjectResponseWrapper[];
   private subscriptions = new SubSink();

   public documentPath: string;
   public documentDir: string;
   public documentId:string;
   public showLoading: boolean;
   message_dashboard: any;
  constructor(protected router: Router,  private projectService: ProjectService){
    this.documentDir = '/assets/documents/';
    console.log('In Process Constructor');
    this.documentPath = this.documentDir + '230.png';
  }

  ngOnInit(): void {
    console.log('document on init');
    this.documentList = [];
    this.projectList = [];
    this.showLoading = false;
    
    console.log('Dashboard Project init');

    this.loadProjectList();
  }

  public onProjectCreate(projectForm: NgForm): void {
    console.log(projectForm.value);

    let projectWrap = projectForm.value;

    //project_modal

    let usr = new UserWrapper();
    let strUsrId = localStorage.getItem("userId");
    usr.id = parseInt(strUsrId);
    projectWrap.user = usr;

    console.log(projectWrap);

    this.showLoading = true;
    this.projectService.createPrjectByAPI(projectWrap).subscribe(
      (response) => {
        console.log(response);
        this.showLoading = false;
        this.modalClose.nativeElement.click();
        this.loadProjectList();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.showLoading = false;
      }
    );
  }

  loadProjectList() {
    let strUsrId = localStorage.getItem("userId");
    let userId = parseInt(strUsrId);
    this.showLoading = true;
    this.subscriptions.add (
      this.projectService.getProjectListByUser(userId).subscribe(
        (response: ProjectResponseWrapper[]) => {
          
          console.log(response);
          if(response.length ===0){
            this.message_dashboard = "No project created"
          }
          this.projectList = response;
          //console.log('Token: '+this.loginRespRep.token);
          //this.loginService.addTokenToCache(response.headers.get('Jwt-Token'));
          this.showLoading = false;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
          this.showLoading = false;
        }
      ) );
  }

  goToUrl(docId: string) {
    
    //http://localhost:4200/#/process-ocr/232
    let targetUrl = 'http://localhost:4200/#/process-mydoc/'+docId;

    console.log('go to urL : '+targetUrl);
    //window.location.href=targetUrl;
    //this.document.location.href = targetUrl;
    this.refresh(docId);
  }

  refresh(docId: string){
    let targetUrl = '/process-mydoc/'+docId;

    this.router.navigate([targetUrl]);
  }
  /*
  public checkUserLoginByApi(): void {
    

    this.loginService.checkUserLoginGet('user','pass').subscribe(
      (response: LoginResponseWrapper) => {
        this.loginRespRep = response;
        console.log(this.loginRespRep);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );

  }*/
}
