import { Component } from '@angular/core';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { SothisService } from './sothis.service';
import { SensorsComponent } from './sensors';
import { SwitchesComponent } from './switches';
import { ActuatorsComponent } from './actuators';
import { IpcamComponent } from './ipcam';

const wideWidth = 2 * 360;
const isWide    = window.innerWidth > wideWidth;

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: isWide ? 'app.component-wide.html' : 'app.component-narrow.html',
  styleUrls: ['app.component.css'],
  directives: [
    SensorsComponent,
    SwitchesComponent,
    ActuatorsComponent,
    IpcamComponent,
    MD_GRID_LIST_DIRECTIVES,
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_TABS_DIRECTIVES
  ],
  providers: [SothisService]
})
export class AppComponent {
  get gridWidth(): string { return `${wideWidth}px`; }
}
