// ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';

// Firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

// Models
import { User } from './register/user.model';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.userSubscription = this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.afDB
            .doc(`${fbUser.uid}/usuario`)
            .valueChanges()
            .subscribe((usuarioObj: any) => {
              const NEW_USER = new User(usuarioObj);
              this.store.dispatch(new SetUserAction(NEW_USER));
        });
      } else {
        this.userSubscription.unsubscribe();
      }
    });
  }

  public crearUsuario(nombre: string, email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((resp: any) => {
      const USER: User = { uid: resp.user.uid, nombre, email };
      this.afDB.doc(`${USER.uid}/usuario`).set(USER).then(() => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.router.navigate(['/']);
      });
    }).catch(() => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire({
        title: 'Correo invalido',
        text: 'El correo ya existe en la base de datos',
        icon: 'error'
      });
    });
  }

  public login(email: string, password: string) {
    this.store.dispatch(new ActivarLoadingAction());
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(() => {
      this.store.dispatch(new DesactivarLoadingAction());
      this.router.navigate(['/']);
    }).catch(() => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire({
          title: 'Credenciales no válidas',
          text: 'El correo o contraseña no son correctos',
          icon: 'error'
      });
    });
  }

  public logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  public isAuth() {
    return this.afAuth.authState.pipe(map((fbUser: any) => {
      if (!fbUser) {
        this.router.navigate(['/login']);
      }
      return fbUser !== null;
    }));
  }
}
