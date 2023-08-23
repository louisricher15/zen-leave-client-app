import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  constructor(private httpClient: HttpClient) {}

  createLeave(payload: {
    startDate: string;
    startDateDayPart: string;
    endDate: string;
    endDateDayPart: string;
  }): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${environment.apiURL}create-leave`,
      payload,
    );
  }
}
