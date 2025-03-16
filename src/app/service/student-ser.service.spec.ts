import { TestBed } from '@angular/core/testing';

import { StudentSerService } from './student-ser.service';

describe('StudentSerService', () => {
  let service: StudentSerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
