// ngrx
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
  public cargando: boolean;
  public subscription: Subscription = new Subscription();

  constructor(private authService: AuthService,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
  }
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }

  public onSubmit(data) {
    this.authService.login(data.email, data.password);
  }
}
