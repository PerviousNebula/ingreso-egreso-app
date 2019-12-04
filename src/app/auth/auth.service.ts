import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import Swal from 'sweetalert2';
import { User } from './register/user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);
    });
  }

  public crearUsuario(nombre: string, email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then((resp: any) => {
      const USER: User = { uid: resp.user.uid, nombre, email };
      this.afDB.doc(`${USER.uid}/usuario`).set(USER).then(() => this.router.navigate(['/']));
    }).catch((error: any) => {
      Swal.fire({
        title: 'Correo invalido',
        text: 'El correo ya existe en la base de datos',
        icon: 'error'
      });
    });
  }
  public login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(() => this.router.navigate(['/']))
                    .catch(() =>
                        Swal.fire({
                          title: 'Credenciales no válidas',
                          text: 'El correo o contraseña no son correctos',
                          icon: 'error'
                    }));
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
