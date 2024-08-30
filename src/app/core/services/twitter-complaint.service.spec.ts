import { TestBed } from '@angular/core/testing';

import { TwitterComplaintService } from './twitter-complaint.service';

describe('TwitterComplaintService', () => {
  let service: TwitterComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TwitterComplaintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
