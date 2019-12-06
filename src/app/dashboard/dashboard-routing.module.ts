import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Guards
//import { AuthGuard } from '../auth/auth.guard';

// Components
import { DashboardComponent } from './dashboard.component';
import { DASHBOARD_ROUTES } from './dashboard.routes';

const ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        children: DASHBOARD_ROUTES,
        //canActivate: [ AuthGuard ]
    }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule { }
