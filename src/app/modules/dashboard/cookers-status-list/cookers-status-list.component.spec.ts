import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookersStatusListComponent } from './cookers-status-list.component';

describe('CookersStatusListComponent', () => {
  let component: CookersStatusListComponent;
  let fixture: ComponentFixture<CookersStatusListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookersStatusListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookersStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
