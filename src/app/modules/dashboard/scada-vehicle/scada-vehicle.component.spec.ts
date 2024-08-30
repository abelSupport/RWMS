import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScadaVehicleComponent } from './scada-vehicle.component';

describe('ScadaVehicleComponent', () => {
  let component: ScadaVehicleComponent;
  let fixture: ComponentFixture<ScadaVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScadaVehicleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScadaVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
