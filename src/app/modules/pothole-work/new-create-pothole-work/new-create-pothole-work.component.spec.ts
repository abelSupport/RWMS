import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCreatePotholeWorkComponent } from './new-create-pothole-work.component';

describe('NewCreatePotholeWorkComponent', () => {
  let component: NewCreatePotholeWorkComponent;
  let fixture: ComponentFixture<NewCreatePotholeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCreatePotholeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCreatePotholeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
