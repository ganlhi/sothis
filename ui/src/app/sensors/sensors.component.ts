import { Component, OnInit } from '@angular/core';
import { SothisService } from '../sothis.service';
import { MD_PROGRESS_CIRCLE_DIRECTIVES } from '@angular2-material/progress-circle';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { IpcamComponent } from '../ipcam';

@Component({
  moduleId: module.id,
  selector: 'app-sensors',
  templateUrl: 'sensors.component.html',
  styleUrls: ['sensors.component.css'],
  directives: [MD_PROGRESS_CIRCLE_DIRECTIVES, MD_GRID_LIST_DIRECTIVES, IpcamComponent]
})
export class SensorsComponent implements OnInit {

  private _sensors: { [key:string]:number; } = {
    temperature: null,
    humidity: null
  };

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
