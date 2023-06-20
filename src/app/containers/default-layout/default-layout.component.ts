import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';
declare var $: any; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public documentType = 'cc';
  roleName:any = localStorage.getItem('roleName');
  buttonShow = false;
  fullName:any = localStorage.getItem('fullnamelog');
  userId:any  = localStorage.getItem('userId');
  userName:any  = localStorage.getItem('userName');
  constructor(private router: Router){

  }
  ngOnInit(): void {
   // this.roleName;
    console.log("default Page:"+this.roleName)
    this.roleCheck();
  }
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  changeDocType(docType: string) {
    this.documentType = docType;
    if(docType ==='sd') {
      docType = 'cc';
    }
    localStorage.setItem('docType', docType);
    console.log('change to: '+docType);
    
  }
  usersDetails(){
    $('#Usersdetail').modal('show');
  }
  roleCheck(){
    if(this.roleName === "ROLE_ADMIN"){
     this.buttonShow = true;
    }
    else{
      this.buttonShow = false;
    }
  }
  usersHelps(){
    $('#UsersHelps').modal('show');
  }
  
}
