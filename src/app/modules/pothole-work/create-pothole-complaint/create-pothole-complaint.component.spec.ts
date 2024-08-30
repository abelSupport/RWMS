import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePotholeComplaintComponent } from './create-pothole-complaint.component';

describe('CreatePotholeComplaintComponent', () => {
  let component: CreatePotholeComplaintComponent;
  let fixture: ComponentFixture<CreatePotholeComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePotholeComplaintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePotholeComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
