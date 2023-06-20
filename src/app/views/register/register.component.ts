import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
declare var $: any;  
@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html',
  providers: [DatePipe]
})
export class RegisterComponent {
  public userCreatePth = environment.remoteAPIBaseUrl + '/account/register'; 
  message: any;
  jsonUser:any;
  message_userName:any;
  message_firstName:any;
  message_email:any;
  message_password:any;
  myDate:any = new Date();
  constructor(private http: HttpClient,private datePipe: DatePipe,){
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy');
  }
  ngOnInit(): void {

  }
  userCreate(){
   var username = (<HTMLInputElement>document.getElementById('username')).value;
   var first_name = (<HTMLInputElement>document.getElementById('first_name')).value
   var last_name = (<HTMLInputElement>document.getElementById('last_name')).value
   var email = (<HTMLInputElement>document.getElementById('email')).value
   var password = (<HTMLInputElement>document.getElementById('password')).value
   var roleId = (<HTMLInputElement>document.getElementById('roleId')).value
   if(username.length === 0 || first_name.length === 0 || email.length === 0 || password.length === 0){
   if(username.length === 0){
    this.message_userName = "* Please fill your user name field."
   setTimeout(()=>{
    this.message_userName = "";
    }, 5000);
   }
   if(first_name.length === 0 ){
    this.message_firstName = "* Please fill your first name field.";
    setTimeout(()=>{
      this.message_firstName = "";
     // $('#message_alert_fillalert').modal('hide');
      }, 5000);
   }
   if(email.length === 0){
    this.message_email = "* Please fill your email address field.";
    setTimeout(()=>{
      this.message_email = "";
     // $('#message_alert_fillalert').modal('hide');
      }, 5000);
   }
   if(password.length === 0){
    this.message_password = "* Please fill your password field.",
    setTimeout(()=>{
      this.message_password = "";
     // $('#message_alert_fillalert').modal('hide');
      }, 5000);
   }
  }
   else{
   console.log(roleId);
   this.jsonUser = {"id": 0,"login": username,"firstName": first_name,"lastName": last_name,"email": email,"imageUrl": "","activated": false,"langKey": "en","authorities": [roleId],"password": password}
   console.log(this.jsonUser);
   const options = {responseType: 'text' as 'json'};
    this.http.post<any>(this.userCreatePth,this.jsonUser,options).subscribe(data => {
     this.message = "User create success."
     $('#messagealert').modal('show');
     setTimeout(()=>{
      this.message = "";
       (<HTMLInputElement>document.getElementById('username')).value ='';
       (<HTMLInputElement>document.getElementById('first_name')).value ='';
       (<HTMLInputElement>document.getElementById('last_name')).value ='';
       (<HTMLInputElement>document.getElementById('email')).value ='';
       (<HTMLInputElement>document.getElementById('password')).value ='';
      $('#messagealert').modal('hide');
      }, 5000);
    },(error: HttpErrorResponse) => {
      //alert(error);
      console.log('Error on get output');
      console.log(error.message);
      if(error.message.length > 0){
        this.message = "Username or email already exist."
      $('#messagealert').modal('show');
      setTimeout(()=>{
        this.message = "";
        $('#messagealert').modal('hide');
        }, 3000);
      }
      
      // this.hasError = true;
      // this.showLoading = false;
      // this.runOCRButtonActive = true;        
    }
    )
  }
  }
}
