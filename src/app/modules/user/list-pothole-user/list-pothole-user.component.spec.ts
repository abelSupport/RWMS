import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPotholeUserComponent } from './list-pothole-user.component';

describe('ListPotholeUserComponent', () => {
  let component: ListPotholeUserComponent;
  let fixture: ComponentFixture<ListPotholeUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPotholeUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPotholeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
