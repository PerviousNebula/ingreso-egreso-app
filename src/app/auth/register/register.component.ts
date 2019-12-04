// ngrx
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public cargando: boolean;

  constructor(public authService: AuthService, 
              private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit(data): void {
    this.authService.crearUsuario(data.nombre, data.email, data.password);
  }

}
