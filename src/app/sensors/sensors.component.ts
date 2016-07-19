import { Component, OnInit } from '@angular/core';
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

  get temperature(): number { return this._sensors['temperature'] }
  get humidity(): number { return this._sensors['humidity'] }
  get temperaturePercentage(): number { return this._sensors['temperature'] * 2 }

  cameraSnapshotUrl: string;
  cameraSnapshotLoading: boolean;

  private static _cameraUrl  = 'http://78.245.98.112:25081';
  private static _cameraAuth = { user: 'guest', password: 'sothiscam' };

  constructor(private service: SothisService) {}

  ngOnInit() {
    this.updateCameraSnapshotUrl();

    this.service.requestCurrentState();

    this.service.sensorUpdate$.subscribe(update => {
      let [type, value] = update;
      this._sensors[type] = value;
    })
  }

  updateCameraSnapshotUrl(delay?: number) {
    this.cameraSnapshotLoading = false;

    if (delay) {
      setTimeout(() => this.updateCameraSnapshotUrl(), delay);
      return;
    }

    let now = Date.now();

    let params = [
      `user=${SensorsComponent._cameraAuth.user}`,
      `pwd=${SensorsComponent._cameraAuth.password}`,
      `ts=${now}`
    ];

    this.cameraSnapshotUrl = SensorsComponent._cameraUrl + '/snapshot.cgi?' + params.join('&');
    this.cameraSnapshotLoading = true;
  }

}
