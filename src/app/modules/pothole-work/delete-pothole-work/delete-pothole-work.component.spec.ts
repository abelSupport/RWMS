import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePotholeWorkComponent } from './delete-pothole-work.component';

describe('DeletePotholeWorkComponent', () => {
  let component: DeletePotholeWorkComponent;
  let fixture: ComponentFixture<DeletePotholeWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePotholeWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePotholeWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
