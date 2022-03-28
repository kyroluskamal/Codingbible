/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GetServerErrorResponseService } from './getServerErrorResponse.service';

describe('Service: GetServerErrorResponse', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetServerErrorResponseService]
    });
  });

  it('should ...', inject([GetServerErrorResponseService], (service: GetServerErrorResponseService) => {
    expect(service).toBeTruthy();
  }));
});
