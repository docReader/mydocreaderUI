import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { LoginRequestWrapper } from './LoginRequestWrapper';
import { LoginResponseWrapper } from './LoginResponseWrapper';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions = new SubSink();
  public isUserLoggedIn : boolean;
  public showLoading: boolean;
  public loginWrap: LoginRequestWrapper;
  public loginRespRep: LoginResponseWrapper;
  userid:any
  userName: any;
  fullname: any;
  messageContent = false;
  message: any;
  constructor(private router: Router, private loginService: LoginService,private http: HttpClient){

  }

  ngOnInit(): void {
    console.log('on Login Service');
    this.buttonActive_login();
    this.showLoading = false;
    this.isUserLoggedIn = this.loginService.isUserLoggedIn();
    
    if(this.isUserLoggedIn){
      this.router.navigateByUrl('/dashboard');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  buttonActive_home(){
    console.log("button Active home1");
    // $('#home_button').css()
     (<HTMLInputElement>document.getElementById("home_button")).style.setProperty("background-color", "black", "important");
     (<HTMLInputElement>document.getElementById("login_button")).style.setProperty("background-color", "", "important");
  }
  buttonActive_login(){
    console.log("button Active login1");
    // $('#textContent_button').css()
    (<HTMLInputElement>document.getElementById("home_button")).style.setProperty("background-color", "", "important");
    (<HTMLInputElement>document.getElementById("login_button")).style.setProperty("background-color", "black", "important");
  }

  public onUserLogin(loginForm: NgForm): void {
    console.log(loginForm.value);
    this.subscriptions.add (
    this.loginService.checkUserLogin(loginForm.value).subscribe(
      (response) => {
        this.loginRespRep = response.body;
        console.log(this.loginRespRep.user);
        this.fullname = this.loginRespRep.user.firstName +" "+this.loginRespRep.user.lastName;
        this.userid = this.loginRespRep.id;
        this.userName = this.loginRespRep.user.login;
        localStorage.setItem('fullnamelog',this.fullname)
        localStorage.setItem('userName',this.userName)
        localStorage.setItem('userId',this.userid)
        //console.log('Token: '+this.loginRespRep.token);
        //this.loginService.addTokenToCache(response.headers.get('Jwt-Token'));
        this.loginService.addTokenToCache(this.loginRespRep.token);
        this.loginService.addUserToCache(response.body);
        this.loginService.addDocTypeToCache("user");
       var fullName = localStorage.getItem('fullnamelog');
      
       console.log("FullName"+fullName);
        if(this.loginRespRep.user !== null){
          this.loginService.addUserIdToCache(this.loginRespRep.user.id + '');
        } else{
          this.loginService.addUserIdToCache('3'); // need to set dynamically
        } 
        this.getRole();
        this.showLoading = false;
      },
      (error: HttpErrorResponse) => {
        this.showLoading = false;
        if(error.status==401){
          this.messageContent = true;
          this.message = "Username or password is incorrect.";
          setTimeout(()=>{
             this.messageContent = false;
            }, 5000);
        }
        else{
          this.messageContent = true;
          this.message = "Unable to process your request. Please try again later or contact with system admin.";
          setTimeout(()=>{
             this.messageContent = false;
            }, 5000);
        }

        
      }
    ));
  }
  
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
  }
  getRole(){
    const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'Content-Type,Accept'};
  // this.userJson = {"pageNumber":this.p,"pageSize": this.listdata};
    var  loginuser = localStorage.getItem('userName');
     this.http.get<any>(environment.remoteAPIBaseUrl + '/users/'+loginuser,{headers}).subscribe(Response => {
      console.log(Response)
      for(var i = 0; i<Response.authorities.length; i++)
      {
        console.log(Response.authorities[i]);
        if(Response.authorities[i] === "ROLE_ADMIN"){
         localStorage.setItem('roleName','ROLE_ADMIN');
        
         var test =localStorage.getItem('roleName');
         console.log(test);
       //  console.log("Rasel:"+demoName);
        }
        else{
         localStorage.setItem('roleName',Response.authorities)
        }
        this.router.navigateByUrl('/dashboard');
      }
      
  });
}
reload(){
  window.location.reload();
}
reset(){
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  this.router.navigate([currentUrl]);
  });
}
  ngOnDestroy(): void {
   // console.log('on Login Destroy');

    this.isUserLoggedIn = false;
    this.showLoading = false;
    this.subscriptions.unsubscribe();

  }

 }
