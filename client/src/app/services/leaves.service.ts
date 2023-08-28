import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Leave } from './models/leave.model';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  constructor(private httpClient: HttpClient) {}

  createLeave(payload: {
    email: string;
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

  deleteLeave(leaveID: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${environment.apiURL}delete-leave/${leaveID}`,
    );
  }

  leaveByID(leaveID: string): Observable<Leave> {
    return this.httpClient.get<Leave>(
      `${environment.apiURL}leave-by-id/${leaveID}`,
    );
  }

  myLeaves(userID: string): Observable<Leave[]> {
    return this.httpClient.get<Leave[]>(
      `${environment.apiURL}my-leaves/${userID}`,
    );
  }

  submitLeave(leaveID: string): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.apiURL}submit-leave/${leaveID}`,
      {},
    );
  }
}
