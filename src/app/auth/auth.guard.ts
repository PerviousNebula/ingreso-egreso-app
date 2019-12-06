import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private auth: AuthService) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.isAuth();
  }
  canLoad() {
    return this.auth.isAuth()
                    .pipe(
                      take(1)
                    );
  }
}
