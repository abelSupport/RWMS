import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCookerStatusDataComponent } from './all-cooker-status-data.component';

describe('AllCookerStatusDataComponent', () => {
  let component: AllCookerStatusDataComponent;
  let fixture: ComponentFixture<AllCookerStatusDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCookerStatusDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCookerStatusDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
