import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePotholeWorkComponent } from './create-pothole-work.component';

describe('CreatePotholeWorkComponent', () => {
  let component: CreatePotholeWorkComponent;
  let fixture: ComponentFixture<CreatePotholeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePotholeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePotholeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
