import { Component, OnInit } from '@angular/core';
import { SothisService } from '../sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-sensors',
  templateUrl: 'sensors.component.html',
  styleUrls: ['sensors.component.css'],
  providers: [SothisService]
})
export class SensorsComponent implements OnInit {

  temperature: number;
  humidity: number;
  cameraSnapshotUrl: string;
  cameraSnapshotLoading: boolean;

  private static _cameraUrl  = 'http://78.245.98.112:25081';
  private static _cameraAuth = { user: 'guest', password: 'sothiscam' };

  constructor(private service: SothisService) {}

  ngOnInit() {
    this.temperature = 21;
    this.humidity = 39;
    this.updateCameraSnapshotUrl();

    this.service.sensorUpdate$.subscribe(msg => {
      let [type, value] = msg;
      if (type === 'temperature') this.temperature = value;
      if (type === 'humidity')    this.humidity    = value;
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
