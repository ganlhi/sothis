import { Sothis } from './../../providers/sothis';
import { Switch } from './switch';
import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-switches',
  templateUrl: 'switches.html'
})
export class SwitchesPage implements OnInit {

  switches: Set<Switch>;

  constructor(public navCtrl: NavController, private sothis: Sothis) {}

  ngOnInit() {
    this.sothis.states$.subscribe(sw => this.switches.add(sw))
  }

  toggled(sw: Switch) {
    this.sothis.setState(sw)
  }

}
