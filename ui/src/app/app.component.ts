import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { SothisService } from './sothis.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: (window.innerWidth > 2*360) ? 'app.component-wide.html' : 'app.component-narrow.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES, MD_CARD_DIRECTIVES, MD_BUTTON_DIRECTIVES],
  providers: [SothisService]
})
export class AppComponent {}
