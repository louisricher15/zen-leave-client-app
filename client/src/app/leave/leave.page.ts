import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../services/models/user.model';
import { of, Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LeavesService } from '../services/leaves.service';
import { Leave } from '../services/models/leave.model';
import { formatDate } from '@angular/common';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.page.html',
  styleUrls: ['./leave.page.scss'],
})
export class LeavePage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  currentLeave: Leave | null = null;

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private leavesService: LeavesService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
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

    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          if (params && params['leaveID']) {
            return this.leavesService.leaveByID(params['leaveID']);
          }
          return of(null);
        }),
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: (leave) => {
          if (leave) {
            this.currentLeave = leave;
          }
        },
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  get leaveDateFormatted(): { start: string; end: string | null } {
    let start = '';
    let end = null;

    if (this.currentLeave) {
      if (this.currentLeave?.startDate === this.currentLeave?.endDate) {
        if (
          this.currentLeave?.startDateDayPart ===
          this.currentLeave?.endDateDayPart
        ) {
          start = `<h1>Le ${formatDate(
            <string>this.currentLeave?.startDate,
            'dd/MM/YYYY',
            'en',
          )}</h1><h2>${
            this.currentLeave?.startDateDayPart === 'morning'
              ? 'uniquement le matin'
              : `uniquement l'après-midi`
          }</h2>`;
        } else {
          start = `<h1>Le ${formatDate(
            <string>this.currentLeave?.startDate,
            'dd/MM/YYYY',
            'en',
          )}</h1><h2>Toute la journée</h2>`;
        }
      } else {
        start = `<h1>Du ${formatDate(
          <string>this.currentLeave?.startDate,
          'dd/MM/YYYY',
          'en',
        )}</h1><h2>${
          this.currentLeave?.startDateDayPart === 'morning'
            ? 'matin'
            : `après-midi`
        }</h2>`;

        end = `<h1>Jusqu'au ${formatDate(
          <string>this.currentLeave?.endDate,
          'dd/MM/YYYY',
          'en',
        )}</h1><h2>${
          this.currentLeave?.endDateDayPart === 'morning'
            ? 'matin'
            : `après-midi`
        }</h2>`;
      }
    }

    return { start, end };
  }

  deleteLeave(): void {
    this.leavesService
      .deleteLeave(<string>this.currentLeave?.id)
      .pipe(take(1))
      .subscribe({
        next: async (leaveDeletionIsOK) => {
          if (leaveDeletionIsOK) {
            if (await this.toastController.getTop()) {
              await this.toastController.dismiss();
            }

            const toast = await this.toastController.create({
              message: `Absence supprimée`,
              duration: 3000,
              position: 'bottom',
              color: 'success',
            });

            await toast.present();

            await this.router.navigate(['/home']);
          }
        },
        error: async () => {
          if (await this.toastController.getTop()) {
            await this.toastController.dismiss();
          }

          const toast = await this.toastController.create({
            message: `Une erreur est survenue lors de la suppression de votre absence`,
            duration: 3000,
            position: 'bottom',
            color: 'danger',
          });

          await toast.present();
        },
      });
  }

  submitForValidation(): void {}
}
