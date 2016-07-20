import { Component, OnInit } from '@angular/core';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { SothisService } from '../sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-switches',
  templateUrl: 'switches.component.html',
  styleUrls: ['switches.component.css'],
  directives: [
    MD_BUTTON_DIRECTIVES,
    MD_GRID_LIST_DIRECTIVES
  ]
})
export class SwitchesComponent implements OnInit {

  private _switches: { [key:string]:boolean; } = {
    mount:  false,
    camera: false,
    usb:    false,
    fan:    false,
    flat:   false,
    lock:   false
  };

  get switchesNames(): string[] { return Object.keys(this._switches) }

  constructor(private service: SothisService) {}

  switchState(name: string): boolean {
    return this._switches[name];
  }

  switchIcon(name: string): string {
    let icons = {
      'mount': 'telescope',
      'fan': 'fan',
      'usb': 'usb',
      'camera': 'camera',
      'flat': 'flatscreen',
      'lock': ['lock', 'lock-open']
    }

    let icon = icons[name];

    if (!icon) return 'plug';
    if (typeof icon == 'string') return icon;
    return icon[this.switchState(name) ? 0 : 1];
  }

  ngOnInit() {
    this.service.requestCurrentState();

    this.service.switchUpdate$.subscribe(update => {
      let [name, state] = update;
      this._switches[name] = state;
    })
  }

  toggle(name: string) {
    console.log(`Toggling ${name}`);
    let targetState = !this._switches[name];
    this.service.setSwitchState(name, targetState);
  }
}
