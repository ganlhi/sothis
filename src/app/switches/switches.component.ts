import { Component, OnInit } from '@angular/core';
import { SothisService } from '../sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-switches',
  templateUrl: 'switches.component.html',
  styleUrls: ['switches.component.css']
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
