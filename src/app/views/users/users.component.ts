import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SystemUserWrapper } from './SystemUserWrapper';
import { SystemUserRoleWrapper } from './SystemUserRoleWrapper';
import { DOCUMENT  } from '@angular/common';
import { Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { UsersService } from '../users/users.service';
import { NgForm } from '@angular/forms';
import { UserWrapper } from "../login/UserWrapper";
import { environment } from '../../../environments/environment';
import { PaginationService } from '../../services/pagination.service';
import { OCRConfReqRespWrapper } from '../process/OCRConfReqRespWrap';
import { ProcessService } from '../process/process.service';
declare var $: any;  
@Component({
  templateUrl: 'users.component.html'
})
export class UsersComponent implements OnInit {
  public userUpdate = environment.remoteAPIBaseUrl + '/users/';
  @ViewChild('myModalClose') modalClose;
   
   systemUserList: SystemUserWrapper[];
   userRoles: SystemUserRoleWrapper[];
   selectedRole: SystemUserRoleWrapper;
   numberlist: any;
   perpage:any = [{ number: '10'},{ number: '25'},{number: '50'}];
   listdata = 10;
   userlist:any;
   config: any;
   p = 1;
  // listdata = 20;
   private subscriptions = new SubSink();
   public showLoading: boolean;
   public ocrConfData: OCRConfReqRespWrapper;
  isActive = false;
  statusPostion: string;
  message: string;
  userJson: { pageNumber: number; pageSize: number; };
  totalRecord: any;
  hasError: boolean;
  userId: number;
  documentType: any;
  errorMessage:any;
  ocrOutputData: any;
  
    constructor(private processService: ProcessService,private service:PaginationService,protected router: Router,  private userService: UsersService,private http: HttpClient){
      console.log('In UserModule Constructor');
    }
  
  ngOnInit(): void {
    this.userPagination();
    this.userList(this.p);
    console.log('user on init');
    this.systemUserList = [];
    this.userRoles = [];
    this.showLoading = false;
    this.ocrOutputData = '';
    this.ocrConfData = new OCRConfReqRespWrapper();
    let strUsrId = localStorage.getItem("userId");
    //localStorage.setItem('docType', 'cc');
    let docType = localStorage.getItem('docType');
    this.documentType = docType;

    this.userId = parseInt(strUsrId);
    
    console.log('Users Data init');

    //this.loadUserList();
    this.loadUserListDummy();
    
    //this.loadUserRoleList();
    this.loadUserRoleListDummy();
    //this.loadOCRConfigurationUserWiseData(this.userId);
  }
  public onUserCreate(userForm: NgForm): void {
    console.log(userForm.value);

    let userWrap = userForm.value;

    let usr = new UserWrapper();
    let strUsrId = localStorage.getItem("userId");
    usr.id = parseInt(strUsrId);
    userWrap.user = usr;

    console.log(userWrap);

    /*
    this.showLoading = true;
    this.userService.createUserByAPI(userWrap).subscribe(
      (response) => {
        console.log(response);
        this.showLoading = false;
        this.modalClose.nativeElement.click();
        this.loadUserList();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
        this.showLoading = false;
      }
    );
    */
  }
  loadOCRConfigurationUserWiseData(userId:any) {
    console.log("userId sdf" +userId);
    console.log(userId);
    this.showLoading = true;
    this.hasError = false;
	 // this.runOCRButtonActive = false;
    console.log('Load OCR Configuration Data');
    this.processService.getOCRConfigurationData(userId).subscribe(
      (responeObj: any) => {
        this.ocrConfData = responeObj.body;
        console.log("Json Data"+this.ocrConfData)
        this.showLoading = false;
        this.hasError = false;
		    //this.runOCRButtonActive = true;
        console.log("test Config");
        console.log(this.ocrConfData);
        // if(this.loadOcrOutputFlag) {
        //   this.loadOCROutputFilesV2Data(this.ocrConfData.outputType, true);
        // }
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
        this.showLoading = false;
        this.hasError = true;
		   // this.runOCRButtonActive = true;
        this.errorMessage = error.message;
      }
    );
  }
  numberList(event:any){
    
    this.listdata = event.target.value;
    this.userList(this.p);
    // localStorage.setItem('listdata',this.listdata)
    // this.getAllData(this.p);
    // this.getPage()
    }
pageChanged(event:any){
      this.config.currentPage = event;
    }
 userList(p:any){
  this.p-= 1;
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept'};
  // this.userJson = {"pageNumber":this.p,"pageSize": this.listdata};
     this.http.get<any>(environment.remoteAPIBaseUrl + '/users/?pageNumber='+this.p+'&pageSize='+this.listdata,{headers}).subscribe(Response => {
   // console.log(data);
      this.p+= 1;
      this.userlist = Response;

         for(var i = 0; i<this.userlist.length; i++){
         // console.log(this.userlist[i].activated);
         
        if(this.userlist[i].activated == true){
          this.isActive = true;
          this.statusPostion  = "confirmed"
          this.userlist[i]['statusPostion'] = this.statusPostion;
          
        }
        else{
           this.isActive = false;
          this.statusPostion = "confirm" 
          this.userlist[i]['statusPostion'] = this.statusPostion;
        }
         // this.statusPostion = ""
        
    //  localStorage.setItem('fontlist',Response)
    }
  })
 }

 userPagination(){
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept'};
 // this.userJson = {"pageNumber":this.p,"pageSize": this.listdata}
  this.http.post<any>(environment.remoteAPIBaseUrl + '/users/pagination/info?pageSize='+this.listdata,{headers}).subscribe(Response => {
    console.log(Response.numberOfData);
    this.totalRecord = Response.numberOfData;
  })
}

 deactivate_user(user:any){
  const headers ={responseType: 'json' as 'json'};
  var userJsondata = {"id":user.id,"firstName":user.firstName,"lastName":user.lastName,"email":user.email,"login":user.login,"activated": false,"langKey": "en","password":user.password,"authorities":user.authorities,};
  this.http.put(this.userUpdate,userJsondata,headers).subscribe(data => {
  this.userList(this.p);
  this.message = "User is deactivated."
  $('#messagepopup').modal('show');
  setTimeout(()=>{
   $('#messagepopup').modal('hide');
   }, 1000);
  
},
(error: HttpErrorResponse) => {
  // if(error.status===401){
  //   if (this.navigated_to_login == 0){
  //       this.router.navigateByUrl('/login');
  //       localStorage.setItem('pl_login_flag',"1");
  //       this.navigated_to_login = 1;
  //   }
  // }  
});
}
activate_user(user:any){
  const options = {responseType: 'text' as 'json'};
  var userJsondata = {"id":user.id,"firstName":user.firstName,"lastName":user.lastName,"email":user.email,"login":user.login,"password":user.password,"langKey": "en","activated": true,"authorities":user.authorities };
  this.http.put(this.userUpdate,userJsondata,options).subscribe(data => {
 // alert("user inserted Successfull.")
  this.userList(this.p);
  this.message = "User is activated."
  $('#messagepopup').modal('show');
  setTimeout(()=>{
    $('#messagepopup').modal('hide');
   }, 1000);
  
},
(error: HttpErrorResponse) => {
  if(error.status===401){
    // if (this.navigated_to_login == 0){
    //     this.router.navigateByUrl('/login');
    //     localStorage.setItem('pl_login_flag',"1");
    //     this.navigated_to_login = 1;
    // }
  }  
});
}


  loadUserList() {
    let strUsrId = localStorage.getItem("userId");
    let userId = parseInt(strUsrId);
    this.showLoading = true;
    this.subscriptions.add (
      this.userService.getAllUserList().subscribe(
        (response: SystemUserWrapper[]) => {
          
          console.log(response);
          this.systemUserList = response;
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

  public pasuserId(userId:any):void{
    this.userId = userId.id;
    console.log(this.userId);
    this.loadOCRConfigurationUserWiseData(this.userId);
}

  public handleOcrConfigurationUserwiserUpdate(ocrConfForm: NgForm): void {
    console.log('Update OCR Configuration');
    let ocrConfWrap = ocrConfForm.value;
    console.log(ocrConfWrap);
    this.showLoading = true;
    this.hasError = false;
    let usr = new UserWrapper();
    
    usr.id = this.userId;
    ocrConfWrap.user = usr;
    ocrConfWrap.outputType = this.ocrConfData.outputType;
    console.log(ocrConfWrap);
    this.processService.updateOCRConfigurationData(this.ocrConfData.id, ocrConfWrap).subscribe(
      (response) => {
        console.log(response);
        this.message = 'Ocr configuration updated'
        $('#messagepopup').modal('show');
        setTimeout(()=>{
         $('#messagepopup').modal('hide');
         }, 1000);
        this.showLoading = false;
        this.hasError = false;
        $('#ocroption_modal').modal('hide');

        // reload server data
        //this.loadOCRConfigurationUserData();
      },
      (error: HttpErrorResponse) => {
        //alert(error.message);
        this.showLoading = false;
        this.hasError = true;
        this.errorMessage = error.message;
      }
    );
  }

  loadUserRoleList() {
    let strUsrId = localStorage.getItem("userId");
    let userId = parseInt(strUsrId);
    this.showLoading = true;
    console.log("test:"+userId)
    this.subscriptions.add (
      this.userService.getUserRoleList().subscribe(
        (response: SystemUserRoleWrapper[]) => {
          
          console.log("response"+response);
          this.userRoles = response;
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

  loadUserListDummy() {
    this.systemUserList.push(new SystemUserWrapper('usr001','user Name 01', 'user Email 01', 'usrRole', 'usrType'));
    this.systemUserList.push(new SystemUserWrapper('usr002','user Name 02', 'user Email 02', 'usrRole', 'usrType'));
    this.systemUserList.push(new SystemUserWrapper('usr003','user Name 03', 'user Email 03', 'usrRole', 'usrType'));
    this.systemUserList.push( new SystemUserWrapper('usr004','user Name 04', 'user Email 04', 'usrRole', 'usrType'));
  }

  loadUserRoleListDummy() {
    this.userRoles.push(new SystemUserRoleWrapper('role01','Role 01'));
    this.userRoles.push(new SystemUserRoleWrapper('role02','Role 02'));
    this.userRoles.push(new SystemUserRoleWrapper('role03','Role 03'));
    this.userRoles.push(new SystemUserRoleWrapper('role04','Role 04'));
  }
 
}
