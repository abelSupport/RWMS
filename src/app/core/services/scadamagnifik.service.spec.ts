import { TestBed } from '@angular/core/testing';

import { ScadamagnifikService } from './scadamagnifik.service';

describe('ScadamagnifikService', () => {
  let service: ScadamagnifikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScadamagnifikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
