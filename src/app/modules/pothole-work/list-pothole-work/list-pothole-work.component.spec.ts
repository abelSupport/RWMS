import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPotholeWorkComponent } from './list-pothole-work.component';

describe('ListPotholeWorkComponent', () => {
  let component: ListPotholeWorkComponent;
  let fixture: ComponentFixture<ListPotholeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPotholeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPotholeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
