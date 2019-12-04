import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  constructor(public _auth: AuthService) { }

  ngOnInit() {
  }

  onSubmit(data): void {
    console.log(data);
    this._auth.crearUsuario(data.nombre, data.email, data.password);
  }

}
