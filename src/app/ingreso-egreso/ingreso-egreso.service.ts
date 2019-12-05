// Firebase
import { AngularFirestore } from '@angular/fire/firestore';

// Services
import { AuthService } from '../auth/auth.service';

// Models
import { IngresoEgreso } from './ingreso-egreso.model';

// ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  private ingresoEgresoListenerSubscription: Subscription = new Subscription();
  private ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(private afDB: AngularFirestore,
              public authService: AuthService,
              private store: Store<AppState>) { }

  public initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store.select('auth')
              .pipe(
                filter(auth => auth.user != null))
              .subscribe(auth => this.ingresoEgresoItems(auth.user.uid));
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscription = this.afDB.collection(`${uid}/ingresos-egresos/items`)
             .snapshotChanges()
             .pipe(
               map(docData => {
                return docData.map(doc => {
                  return {
                    uid: doc.payload.doc.id,
                    ...doc.payload.doc.data()
                  };
                });
               }))
             .subscribe((coleccion: any[]) => {
               this.store.dispatch(new SetItemsAction(coleccion));
             });
  }

  public cancelarSubscriptions() {
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  public crearIngresoEgreso(IngresoEgreso: IngresoEgreso) {
    const USER = this.authService.getUsuario();
    return this.afDB.doc(`${USER.uid}/ingresos-egresos`)
             .collection('items')
             .add({ ...IngresoEgreso });
  }

  public borrarIngresoEgreso(uid: string) {
    const USER = this.authService.getUsuario();
    return this.afDB.doc(`${USER.uid}/ingresos-egresos/items/${uid}`).delete();
  }
}
