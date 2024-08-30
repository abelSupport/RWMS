import { TestBed } from '@angular/core/testing';

import { PotholeUserService } from './pothole-user.service';

describe('PotholeUserService', () => {
  let service: PotholeUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotholeUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
