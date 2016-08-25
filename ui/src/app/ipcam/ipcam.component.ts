import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { SothisService } from '../sothis.service';
import { environment } from '../environment';

@Component({
  moduleId: module.id,
  selector: 'app-ipcam',
  templateUrl: 'ipcam.component.html',
  styleUrls: ['ipcam.component.css']
})
export class IpcamComponent implements OnInit {

  cameraSnapshotUrl: string;
  cameraSnapshotLoading: boolean;

  private static _cameraUrl  = environment.ipcam.url;
  private static _cameraAuth = environment.ipcam.auth;

  constructor(private _http: Http) {}

  ngOnInit() {
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
      `user=${IpcamComponent._cameraAuth.user}`,
      `pwd=${IpcamComponent._cameraAuth.password}`,
      `ts=${now}`
    ];

    this.cameraSnapshotUrl = IpcamComponent._cameraUrl + '/snapshot.cgi?' + params.join('&');
    this.cameraSnapshotLoading = true;
  }

  cameraMove(dir: string) {
    let cmd = null;
    switch(dir) {
      case 'up':    cmd = 0; break;
      case 'down':  cmd = 2; break;
      case 'left':  cmd = 4; break;
      case 'right': cmd = 6; break;
    }

    if (cmd !== null) {
      let params = [
        `loginuse=${IpcamComponent._cameraAuth.user}`,
        `loginpas=${IpcamComponent._cameraAuth.password}`,
        `command=${cmd}`,
        `onestep=1`
      ];

      let url = IpcamComponent._cameraUrl + '/decoder_control.cgi?' + params.join('&');

      this._http
        .get(url)
        .subscribe(res => {}, err => {});
    }
  }

}
