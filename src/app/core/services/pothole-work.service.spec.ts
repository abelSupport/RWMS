import { TestBed } from '@angular/core/testing';

import { PotholeWorkService } from './pothole-work.service';

describe('PotholeWorkService', () => {
  let service: PotholeWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PotholeWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
