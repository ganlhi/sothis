import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SothisService {
  private static _baseUrl = 'localhost:1880';
  private _ws: WebSocket;
  private _sensorUpdateSource: Subject<[string, number]> = new Subject<[string, number]>();

  sensorUpdate$ = this._sensorUpdateSource.asObservable();

  constructor() {
    this._initWebSocket();
  }

  private _initWebSocket(retrySeconds: number = 2): void {
    let reconnectScheduled = false;
    let _scheduleReconnect = () => {
      if (!reconnectScheduled) {
        setTimeout(() => this._initWebSocket(retrySeconds * 2), 1000 * retrySeconds);
      }
      reconnectScheduled = true;
    }

    console.log('Connecting to websocket');

    this._ws = new WebSocket(`ws://${SothisService._baseUrl}/ws`);

    this._ws.onopen = (e) => console.log('Connected to ws');
    this._ws.onmessage = this._handleWsMessage.bind(this);

    this._ws.onclose = () => {
      console.log(`Websocket closed, retrying in ${retrySeconds} seconds`);
      _scheduleReconnect();
    }

    this._ws.onerror = () => {
      console.log('Error connecting to ws');
      _scheduleReconnect();
    };
  }

  private _handleWsMessage(e: MessageEvent): void {
    let data = JSON.parse(e.data);
    let topicParts: string[] = data.topic.split('/');

    switch (topicParts[0]) {
      case 'sensor':
        this._sensorUpdateSource.next([topicParts[1], <number>data.payload]);
        break;

      default:
        break;
    }
  }

}
