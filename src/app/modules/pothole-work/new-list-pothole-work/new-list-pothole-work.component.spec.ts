import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewListPotholeWorkComponent } from './new-list-pothole-work.component';

describe('NewListPotholeWorkComponent', () => {
  let component: NewListPotholeWorkComponent;
  let fixture: ComponentFixture<NewListPotholeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewListPotholeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewListPotholeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
