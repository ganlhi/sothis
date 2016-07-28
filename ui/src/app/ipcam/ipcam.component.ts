import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-ipcam',
  templateUrl: 'ipcam.component.html',
  styleUrls: ['ipcam.component.css']
})
export class IpcamComponent implements OnInit {

  cameraSnapshotUrl: string;
  cameraSnapshotLoading: boolean;

  private static _cameraUrl  = 'http://78.245.98.112:25081';
  private static _cameraAuth = { user: 'guest', password: 'sothiscam' };

  constructor() {}

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

}
