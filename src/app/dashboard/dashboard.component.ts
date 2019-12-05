import { Component, OnInit } from '@angular/core';
import { IngresoEgresoService } from '../ingreso-egreso/ingreso-egreso.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  constructor(private ingresoEgresoService: IngresoEgresoService,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.initAuthListener();
    this.ingresoEgresoService.initIngresoEgresoListener();
  }

}
