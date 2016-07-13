import { Component, OnInit } from '@angular/core';
import { SothisService } from '../sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-actuators',
  templateUrl: 'actuators.component.html',
  styleUrls: ['actuators.component.css']
})
export class ActuatorsComponent implements OnInit {

  private _shutters: { [key:string]:boolean; } = {
    scope: false,
    guide: false
  }

  private _roofState: boolean|string = null;

  get roofState(): boolean|string { return this._roofState }
  get shuttersNames(): string[] { return Object.keys(this._shutters) }

  constructor(private service: SothisService) {}

  shutterState(name: string): boolean {
    return this._shutters[name];
  }

  ngOnInit() {
    this.service.requestCurrentState();

    this.service.shutterUpdate$.subscribe(update => {
      let [name, state] = update;
      this._shutters[name] = state;
    })

    this.service.roofUpdate$.subscribe(newState => this._roofState = newState);
  }

  toggle(name: string) {
    console.log(`Toggling ${name}`);
    let targetState = !this._shutters[name];
    this.service.setShutterState(name, targetState);
  }

  setRoofState(targetState: boolean) {
    if (targetState) {
      if (this._roofState == true || this._roofState == 'opening') return;
    } else {
      if (this._roofState == false || this._roofState == 'closing') return;
    }

    console.log(`Requesting roof state: ${targetState}.`);
    this.service.setRoofState(targetState);
  }

}
