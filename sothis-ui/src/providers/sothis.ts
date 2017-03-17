import { Observable } from 'rxjs/Observable';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';
import { Switch } from './../pages/switches/switch';
import { Subject } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class Sothis {

  url = 'http://78.245.98.112:42080/api'

  ws = new $WebSocket('ws://78.245.98.112:42081')

  states$ = new Subject<Switch>()

  constructor(public http: Http) {

    this.getStates()
      .flatMap(states => {
        return Object.keys(states)
          .map(name => <Switch>({
            name,
            status: Boolean(states[name])
          }))
      })
      .subscribe(this.states$)

    // this.ws.getDataStream()
    //   .map(message => <Switch>message)
    //   .subscribe(this.states$)

  }

  getStates() {
    // return this.http.get(this.url + '/')
    return Observable.of({ mount: false, dslr: false, usb: true })
  }

  setState(sw: Switch) {
    // const status = sw.status ? 1 : 0
    // return this.http.post(`${this.url}/${sw.name}/${status}`, null)
    this.states$.next(sw)
  }

}
