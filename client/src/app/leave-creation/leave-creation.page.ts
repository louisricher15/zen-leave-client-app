import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject, take } from 'rxjs';
import { LeavesService } from '../services/leaves.service';

@Component({
  selector: 'app-leave-creation',
  templateUrl: './leave-creation.page.html',
  styleUrls: ['./leave-creation.page.scss'],
})
export class LeaveCreationPage implements OnInit, OnDestroy {
  leaveCreationForm: FormGroup = new FormGroup({});

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private leavesService: LeavesService,
  ) {}

  ngOnInit() {
    this.leaveCreationForm = this.formBuilder.group({
      startDate: new FormControl(null, Validators.required),
      startDateDayPart: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      endDateDayPart: new FormControl(null, Validators.required),
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
