/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { SensorsComponent } from './sensors.component';
import { SothisService } from '../sothis.service';

describe('Component: Sensors', () => {
  it('should create an instance', () => {
    inject([SothisService], (service: SothisService) => {
      let component = new SensorsComponent(service);
      expect(component).toBeTruthy();
    })
  });
});
