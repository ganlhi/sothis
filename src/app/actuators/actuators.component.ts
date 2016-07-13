import { Component, OnInit } from '@angular/core';
import { SothisService } from '../sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-actuators',
  templateUrl: 'actuators.component.html',
  styleUrls: ['actuators.component.css']
})
export class ActuatorsComponent implements OnInit {

  constructor(private service: SothisService) {}

  ngOnInit() {
  }

}
