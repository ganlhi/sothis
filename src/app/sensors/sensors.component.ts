import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-sensors',
  templateUrl: 'sensors.component.html',
  styleUrls: ['sensors.component.css']
})
export class SensorsComponent implements OnInit {

  temperature: number;
  humidity: number;
  cameraSnapshotUrl: string;
  cameraSnapshotLoading: boolean;

  static _cameraUrl  = 'http://78.245.98.112:25081';
  static _cameraAuth = { user: 'guest', password: 'sothiscam' };

  constructor() {}

  ngOnInit() {
    this.temperature = 21;
    this.humidity = 39;
    this.updateCameraSnapshotUrl();
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
