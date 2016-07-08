/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

import { SwitchesComponent } from './switches.component';

describe('Component: Switches', () => {
  it('should create an instance', () => {
    let component = new SwitchesComponent();
    expect(component).toBeTruthy();
  });
});
