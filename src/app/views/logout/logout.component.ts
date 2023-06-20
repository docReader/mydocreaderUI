import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: 'logout processing'
})
export class LogoutComponent implements OnInit, OnDestroy {

  public isUserLoggedIn : boolean;
  public showLoading: boolean;

  constructor(private router: Router){
  }

  ngOnInit(): void {
    console.log('Logout here');
    localStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    this.router.navigateByUrl('/login');
  }

  ngOnDestroy(): void {
    console.log('on Logout Destroy');

    this.isUserLoggedIn = false;
    this.showLoading = false;    
  }

 }
