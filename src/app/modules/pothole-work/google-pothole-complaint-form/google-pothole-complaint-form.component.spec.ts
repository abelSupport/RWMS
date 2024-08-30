import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePotholeComplaintFormComponent } from './google-pothole-complaint-form.component';

describe('GooglePotholeComplaintFormComponent', () => {
  let component: GooglePotholeComplaintFormComponent;
  let fixture: ComponentFixture<GooglePotholeComplaintFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GooglePotholeComplaintFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GooglePotholeComplaintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
