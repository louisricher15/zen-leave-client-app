import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  decodeUserToken(token: string | null): Observable<User | null> {
    return token !== null
      ? this.httpClient.get<User>(
          `${environment.apiURL}decode-user-token/${token}`,
        )
      : of(null);
  }

  login(email: string, code: string): Observable<string> {
    return this.httpClient.post<string>(`${environment.apiURL}login`, {
      email,
      code,
    });
  }

  sendSecurityCode(email: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${environment.apiURL}send-security-code`,
      { email },
    );
  }

  updateUserProfile(payload: {
    email: string;
    lastName: string;
    firstName: string;
    internal: boolean;
    team: string;
  }): Observable<{ user: User; token: string }> {
    return this.httpClient.put<{ user: User; token: string }>(
      `${environment.apiURL}update-user-profile`,
      payload,
    );
  }
}
