import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantexVtsFeatureComponent } from './plantex-vts-feature.component';

describe('PlantexVtsFeatureComponent', () => {
  let component: PlantexVtsFeatureComponent;
  let fixture: ComponentFixture<PlantexVtsFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantexVtsFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantexVtsFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
