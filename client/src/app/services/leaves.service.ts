import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Leave } from './models/leave.model';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root',
})
export class LeavesService {
  constructor(private httpClient: HttpClient) {}

  allLeaves(): Observable<{ users: User[]; leaves: Leave[] }> {
    return this.httpClient.get<{ users: User[]; leaves: Leave[] }>(
      `${environment.apiURL}all-leaves`,
    );
  }

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

  myTeamLeaves(team: string): Observable<{ users: User[]; leaves: Leave[] }> {
    return this.httpClient.get<{ users: User[]; leaves: Leave[] }>(
      `${environment.apiURL}my-team-leaves/${team}`,
    );
  }

  rejectLeave(leaveID: string | undefined): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.apiURL}reject-leave/${leaveID}`,
      {},
    );
  }

  submitLeave(leaveID: string): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.apiURL}submit-leave/${leaveID}`,
      {},
    );
  }

  validateLeave(leaveID: string | undefined): Observable<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.apiURL}validate-leave/${leaveID}`,
      {},
    );
  }
}
