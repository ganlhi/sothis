/* tslint:disable:no-unused-variable */

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';
import { SothisService } from './sothis.service';

describe('Sothis Service', () => {
  beforeEachProviders(() => [SothisService]);

  it('should ...',
      inject([SothisService], (service: SothisService) => {
    expect(service).toBeTruthy();
  }));
});
