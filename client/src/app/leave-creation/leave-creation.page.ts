import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { LeavesService } from '../services/leaves.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/models/user.model';

@Component({
  selector: 'app-leave-creation',
  templateUrl: './leave-creation.page.html',
  styleUrls: ['./leave-creation.page.scss'],
})
export class LeaveCreationPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  leaveCreationForm: FormGroup = new FormGroup({});

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private leavesService: LeavesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.leaveCreationForm = this.formBuilder.group({
      startDate: new FormControl(null, Validators.required),
      startDateDayPart: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      endDateDayPart: new FormControl(null, Validators.required),
    });

    this.activatedRoute.url
      .pipe(
        switchMap(() =>
          this.authService.decodeUserToken(
            localStorage.getItem('zl-user-token'),
          ),
        ),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.currentUser = user;
          }
        },
        error: async () => {
          localStorage.removeItem('zl-user-token');

          await this.router.navigate(['/login']);
        },
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  createLeave(): void {
    if (this.leaveCreationForm.valid) {
      this.leavesService
        .createLeave(this.leaveCreationForm.getRawValue())
        .pipe(take(1))
        .subscribe({
          next: (isLeaveCreationOK) => {
            // TODO: alert + redirect
          },
          error: async () => {
            // TODO alert
          },
        });
    }
  }

  isStartDateEnabled(date: string): boolean {
    return (
      new Date(new Date().setHours(4)).setMinutes(20).valueOf() -
        new Date(new Date(date).setHours(4)).setMinutes(20).valueOf() <=
      24 * 60 * 60 * 1000
    );
  }
}
