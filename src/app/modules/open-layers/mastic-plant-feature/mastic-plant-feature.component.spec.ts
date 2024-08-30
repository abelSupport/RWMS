import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasticPlantFeatureComponent } from './mastic-plant-feature.component';

describe('MasticPlantFeatureComponent', () => {
  let component: MasticPlantFeatureComponent;
  let fixture: ComponentFixture<MasticPlantFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasticPlantFeatureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasticPlantFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
