import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotholeComplaintFormComponent } from './pothole-complaint-form.component';

describe('PotholeComplaintFormComponent', () => {
  let component: PotholeComplaintFormComponent;
  let fixture: ComponentFixture<PotholeComplaintFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotholeComplaintFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotholeComplaintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
