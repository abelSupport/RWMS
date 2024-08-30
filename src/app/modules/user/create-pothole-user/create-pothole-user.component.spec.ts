import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePotholeUserComponent } from './create-pothole-user.component';

describe('CreatePotholeUserComponent', () => {
  let component: CreatePotholeUserComponent;
  let fixture: ComponentFixture<CreatePotholeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePotholeUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePotholeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
