import { Component } from '@angular/core';

import { SwitchesPage } from '../switches/switches';
import { CameraPage } from '../camera/camera';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabSwitches: any = SwitchesPage;
  tabCamera: any = CameraPage;

  constructor() {

  }
}
