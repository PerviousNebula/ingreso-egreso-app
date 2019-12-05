// ngrx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

// Services
import { AuthService } from '../../auth/auth.service';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy {
  public userName: string;
  private subscription: Subscription = new Subscription();

  constructor(private _auth:AuthService,
              private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
              .pipe(
                filter(auth => auth.user != null)
              ).subscribe(auth => this.userName = auth.user.nombre);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public logout() {
    this._auth.logout();
    this.ingresoEgresoService.cancelarSubscriptions();
  }

}
