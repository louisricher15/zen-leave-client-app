import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  decodeUserToken(token: string | null): Observable<any> {
    return token
      ? this.httpClient.get<any>(
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
}
