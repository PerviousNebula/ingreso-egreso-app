// ngrx
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  public userName: string;
  private subscription: Subscription = new Subscription();

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
                                  .pipe(
                                    filter(auth => auth.user != null)
                                  ).subscribe(auth => this.userName = auth.user.nombre);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
