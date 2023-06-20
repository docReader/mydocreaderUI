import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GHomeComponent } from './g-home.component';

describe('GHomeComponent', () => {
  let component: GHomeComponent;
  let fixture: ComponentFixture<GHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
