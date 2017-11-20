import { TestBed, inject } from '@angular/core/testing';

import { ApiGunService } from './api-gun.service';

describe('ApiGunService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiGunService]
    });
  });

  it('should be created', inject([ApiGunService], (service: ApiGunService) => {
    expect(service).toBeTruthy();
  }));
});
