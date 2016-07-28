import { Component, OnInit, Input } from '@angular/core';
import { SothisService } from '../sothis.service';
import { MD_PROGRESS_CIRCLE_DIRECTIVES } from '@angular2-material/progress-circle';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';

@Component({
  moduleId: module.id,
  selector: 'app-sensors',
  templateUrl: 'sensors.component.html',
  styleUrls: ['sensors.component.css'],
  directives: [MD_PROGRESS_CIRCLE_DIRECTIVES, MD_GRID_LIST_DIRECTIVES]
})
export class SensorsComponent implements OnInit {

  private _sensors: { [key:string]:number; } = {
    temperature: null,
    humidity: null
  };

  @Input() small = false;

  get height(): string { return this.small ? '100px' : '1:1' }
  get cols(): number { return this.small ? 1 : 2 }
  get temperature(): number { return this._sensors['temperature'] }
  get humidity(): number { return this._sensors['humidity'] }
  get temperaturePercentage(): number { return this._sensors['temperature'] * 2 }


  constructor(private service: SothisService) {}

  ngOnInit() {
    this.service.requestCurrentState();

    this.service.sensorUpdate$.subscribe(update => {
      let [type, value] = update;
      this._sensors[type] = value;
    })
  }

}
