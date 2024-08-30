import { TestBed } from '@angular/core/testing';

import { CookerdataService } from './cookerdata.service';

describe('CookerdataService', () => {
  let service: CookerdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookerdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
