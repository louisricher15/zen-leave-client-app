import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserTokenResolver implements Resolve<any> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<any> {
    return this.authService.decodeUserToken(
      localStorage.getItem('zl-user-token'),
    );
  }
}
