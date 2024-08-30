import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePotholeComplaintMapComponent } from './google-pothole-complaint-map.component';

describe('GooglePotholeComplaintMapComponent', () => {
  let component: GooglePotholeComplaintMapComponent;
  let fixture: ComponentFixture<GooglePotholeComplaintMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GooglePotholeComplaintMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GooglePotholeComplaintMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
