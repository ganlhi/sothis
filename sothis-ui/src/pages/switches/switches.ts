import { Switch } from './switch';
import { Component, OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-switches',
  templateUrl: 'switches.html'
})
export class SwitchesPage implements OnInit {

  switches: Set<Switch>;

  constructor(public navCtrl: NavController) {}

  ngOnInit() {

  }

}
