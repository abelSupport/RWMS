import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookerlistComponent } from './cookerlist.component';

describe('CookerlistComponent', () => {
  let component: CookerlistComponent;
  let fixture: ComponentFixture<CookerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookerlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
