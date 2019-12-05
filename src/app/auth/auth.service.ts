// ngrx
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { SetUserAction, UnsetUserAction } from './auth.actions';
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
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubscription: Subscription = new Subscription();
  private usuario: User;

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
              this.usuario = NEW_USER;
        });
      } else {
        this.usuario = null;
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
    }).catch((err: any) => {
      this.store.dispatch(new DesactivarLoadingAction());
      Swal.fire({
        title: 'Correo o contraseña invalidos',
        text: 'Error al crear la centa',
        icon: 'error'
      });
      console.error(err);
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
    this.store.dispatch(new UnsetUserAction());
  }

  public isAuth() {
    return this.afAuth.authState.pipe(map((fbUser: any) => {
      if (!fbUser) {
        this.router.navigate(['/login']);
      }
      return fbUser !== null;
    }));
  }

  public getUsuario() {
    return { ...this.usuario };
  }
}
