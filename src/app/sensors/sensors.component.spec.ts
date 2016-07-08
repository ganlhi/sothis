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

describe('Component: Sensors', () => {
  it('should create an instance', () => {
    let component = new SensorsComponent();
    expect(component).toBeTruthy();
  });
});
