import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPotholeWorkComponent } from './add-pothole-work.component';

describe('AddPotholeWorkComponent', () => {
  let component: AddPotholeWorkComponent;
  let fixture: ComponentFixture<AddPotholeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPotholeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPotholeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
