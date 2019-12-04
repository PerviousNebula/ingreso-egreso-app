import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(private _auth: AuthService) { }

  ngOnInit() {
  }

  public onSubmit(data) {
    this._auth.login(data.email, data.password);
  }

}
