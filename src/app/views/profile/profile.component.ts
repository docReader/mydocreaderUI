import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  ngOnInit(): void {
   
  }
}
