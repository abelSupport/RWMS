import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotholeDashboardComponent } from './pothole-dashboard.component';

describe('PotholeDashboardComponent', () => {
  let component: PotholeDashboardComponent;
  let fixture: ComponentFixture<PotholeDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotholeDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotholeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
