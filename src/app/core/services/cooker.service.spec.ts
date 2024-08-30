import { TestBed } from '@angular/core/testing';

import { CookerService } from './cooker.service';

describe('CookerService', () => {
  let service: CookerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
