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
import { ToastController } from '@ionic/angular';
import { Leave } from '../services/models/leave.model';

@Component({
  selector: 'app-leave-creation',
  templateUrl: './leave-creation.page.html',
  styleUrls: ['./leave-creation.page.scss'],
})
export class LeaveCreationPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  creating = false;
  leaveCreationForm: FormGroup = new FormGroup({});
  myLeaves: Leave[] = [];
  isStartDateEnabled: ((dateIsoString: string) => boolean) | null = null;

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private leavesService: LeavesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.leaveCreationForm = this.formBuilder.group({
      startDate: new FormControl(null, Validators.required),
      startDateDayPart: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
      endDateDayPart: new FormControl(null, Validators.required),
    });

    if (this.currentUser) {
      this.loadMyLeaves();
    }

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

            this.leaveCreationForm.reset();

            this.loadMyLeaves();
          }
        },
        error: async () => {
          localStorage.removeItem('zl-user-token');

          if (await this.toastController.getTop()) {
            await this.toastController.dismiss();
          }

          const toast = await this.toastController.create({
            message: `Votre session a expiré`,
            duration: 3000,
            position: 'bottom',
          });

          await toast.present();

          await this.router.navigate(['/login']);
        },
      });
  }

  ngOnDestroy() {
    this.leaveCreationForm.reset();
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  get endDayParts(): { label: string; value: string }[] {
    return [
      {
        canShow: this.myLeaves.every((leave) => {
          const start = new Date(leave?.startDate).valueOf();
          const end = new Date(leave?.endDate).valueOf();

          const d = new Date(
            new Date(this.leaveCreationForm.get('endDate')?.value).setHours(4),
          )
            .setMinutes(20)
            .valueOf();

          return !this.myLeaves
            .filter(
              (leave) =>
                leave?.startDateDayPart === 'morning' &&
                leave?.endDateDayPart === 'morning' &&
                leave?.startDate === leave?.endDate,
            )
            .some((leave) => new Date(leave?.startDate).valueOf() === d);
        }),
        label: 'Au matin',
        value: 'morning',
      },
      {
        canShow: this.myLeaves.every((leave) => {
          const start = new Date(leave?.startDate).valueOf();
          const end = new Date(leave?.endDate).valueOf();

          const d = new Date(
            new Date(this.leaveCreationForm.get('endDate')?.value).setHours(16),
          )
            .setMinutes(20)
            .valueOf();

          return !this.myLeaves
            .filter(
              (leave) =>
                leave?.startDateDayPart === 'afternoon' &&
                leave?.endDateDayPart === 'afternoon' &&
                leave?.startDate === leave?.endDate,
            )
            .some((leave) => new Date(leave?.startDate).valueOf() === d);
        }),
        label: "À l'après-midi",
        value: 'afternoon',
      },
    ]
      .filter((option) => option.canShow)
      .map((option) => {
        return { label: option.label, value: option.value };
      });
  }

  get startDayParts(): { label: string; value: string }[] {
    return [
      {
        canShow: this.myLeaves.every((leave) => {
          const start = new Date(leave?.startDate).valueOf();
          const end = new Date(leave?.endDate).valueOf();

          const d = new Date(
            new Date(this.leaveCreationForm.get('startDate')?.value).setHours(
              4,
            ),
          )
            .setMinutes(20)
            .valueOf();

          return !this.myLeaves
            .filter(
              (leave) =>
                leave?.startDateDayPart === 'morning' &&
                leave?.endDateDayPart === 'morning' &&
                leave?.startDate === leave?.endDate,
            )
            .some((leave) => new Date(leave?.startDate).valueOf() === d);
        }),
        label: 'Du matin',
        value: 'morning',
      },
      {
        canShow: this.myLeaves.every((leave) => {
          const start = new Date(leave?.startDate).valueOf();
          const end = new Date(leave?.endDate).valueOf();

          const d = new Date(
            new Date(this.leaveCreationForm.get('startDate')?.value).setHours(
              16,
            ),
          )
            .setMinutes(20)
            .valueOf();

          return !this.myLeaves
            .filter(
              (leave) =>
                leave?.startDateDayPart === 'afternoon' &&
                leave?.endDateDayPart === 'afternoon' &&
                leave?.startDate === leave?.endDate,
            )
            .some((leave) => new Date(leave?.startDate).valueOf() === d);
        }),
        label: "De l'après-midi",
        value: 'afternoon',
      },
    ]
      .filter((option) => option.canShow)
      .map((option) => {
        return { label: option.label, value: option.value };
      });
  }

  createLeave(): void {
    if (this.leaveCreationForm.valid) {
      this.creating = true;

      this.leavesService
        .createLeave({
          email: this.currentUser?.email,
          ...this.leaveCreationForm.getRawValue(),
        })
        .pipe(take(1))
        .subscribe({
          next: async (newLeaveID) => {
            if (newLeaveID) {
              this.creating = false;

              if (await this.toastController.getTop()) {
                await this.toastController.dismiss();
              }

              const toast = await this.toastController.create({
                message: `Absence créée`,
                duration: 3000,
                position: 'bottom',
                color: 'success',
              });

              await toast.present();

              await this.router.navigate(['/leave', newLeaveID]);
            }
          },
          error: async () => {
            this.creating = false;

            if (await this.toastController.getTop()) {
              await this.toastController.dismiss();
            }

            const toast = await this.toastController.create({
              message: `Une erreur est survenue lors de la création de votre absence`,
              duration: 3000,
              position: 'bottom',
              color: 'danger',
            });

            await toast.present();
          },
        });
    }
  }

  buildStartDateEnabled(): void {
    this.isStartDateEnabled = (date: string) => {
      const dateIsOnHalfMorningLeave = this.myLeaves
        .filter(
          (leave) =>
            leave?.startDateDayPart === 'morning' &&
            leave?.endDateDayPart === 'morning' &&
            leave?.startDate === leave?.endDate,
        )
        .some(
          (leave) =>
            new Date(leave?.startDate).valueOf() ===
            new Date(new Date(date).setHours(4)).setMinutes(20).valueOf(),
        );

      const dateIsOnHalfAfternoonLeave = this.myLeaves
        .filter(
          (leave) =>
            leave?.startDateDayPart === 'afternoon' &&
            leave?.endDateDayPart === 'afternoon' &&
            leave?.startDate === leave?.endDate,
        )
        .some(
          (leave) =>
            new Date(leave?.startDate).valueOf() ===
            new Date(new Date(date).setHours(16)).setMinutes(20).valueOf(),
        );

      const dateInRange = this.myLeaves.some((leave) => {
        return (
          !dateIsOnHalfMorningLeave &&
          !dateIsOnHalfAfternoonLeave &&
          new Date(leave?.startDate).valueOf() <=
            new Date(
              new Date(date).setHours(
                leave?.startDateDayPart === 'morning' ? 4 : 16,
              ),
            )
              .setMinutes(20)
              .valueOf() &&
          new Date(leave?.endDate).valueOf() >=
            new Date(
              new Date(date).setHours(
                leave?.endDateDayPart === 'morning' ? 4 : 16,
              ),
            )
              .setMinutes(20)
              .valueOf()
        );
      });

      const dateIsAtLeastTodayOrLater =
        new Date(new Date().setHours(4)).setMinutes(20).valueOf() -
          new Date(new Date(date).setHours(4)).setMinutes(20).valueOf() <=
        24 * 60 * 60 * 1000;

      return (
        (!dateIsOnHalfMorningLeave || !dateIsOnHalfAfternoonLeave) &&
        !dateInRange &&
        dateIsAtLeastTodayOrLater
      );
    };
  }

  loadMyLeaves(): void {
    if (this.currentUser) {
      this.leavesService
        .myLeaves(this.currentUser?.id)
        .pipe(take(1))
        .subscribe({
          next: (myLeaves) => {
            if (myLeaves) {
              this.myLeaves = myLeaves;

              this.buildStartDateEnabled();
            }
          },
        });
    }
  }
}
