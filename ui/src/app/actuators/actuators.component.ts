import { Component, OnInit, Input } from '@angular/core';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_PROGRESS_BAR_DIRECTIVES } from '@angular2-material/progress-bar';
import { SothisService } from '../sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-actuators',
  templateUrl: 'actuators.component.html',
  styleUrls: ['actuators.component.css'],
  directives: [
    MD_GRID_LIST_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_PROGRESS_BAR_DIRECTIVES
  ]
})
export class ActuatorsComponent implements OnInit {

  private _shutters: { [key:string]:boolean; } = {
    scope: false,
    guide: false
  }

  private _lockState: boolean        = null;
  private _roofState: boolean|string = null;

  @Input() small = false;

  get lockState(): boolean|string { return this._lockState }
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

    this.service.switchUpdate$.subscribe(update => {
      let [name, state] = update;
      if (name == 'lock') this._lockState = state;
    })

    this.service.roofUpdate$.subscribe(newState => this._roofState = newState);
  }

  toggle(name: string) {
    console.log(`Toggling ${name}`);
    let targetState = !this._shutters[name];
    this.service.setShutterState(name, targetState);
  }

  toggleLock() {
    if (this._roofState !== false) return;

    let targetState = !this._lockState;
    this.service.setSwitchState('lock', targetState);
  }

  setRoofState(targetState: boolean) {
    if (this._roofState === 'opening' || this._roofState === 'closing') return;

    if (targetState) {
      if (this._roofState === true || this._lockState === true) return;
    } else {
      if (this._roofState === false) return;
    }

    console.log(`Requesting roof state: ${targetState}.`);
    this.service.setRoofState(targetState);
  }

}
