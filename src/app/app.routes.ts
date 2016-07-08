import { provideRouter, RouterConfig }  from '@angular/router';
import { SensorsComponent } from './sensors';
import { SwitchesComponent } from './switches';
import { ActuatorsComponent } from './actuators';

export const routes: RouterConfig = [
  { path: 'sensors',   component: SensorsComponent   },
  { path: 'switches',  component: SwitchesComponent  },
  { path: 'actuators', component: ActuatorsComponent },
  {
    path: '',
    redirectTo: '/sensors',
    pathMatch: 'full'
  }
];

export const APP_ROUTER_PROVIDER = [
  provideRouter(routes)
];
