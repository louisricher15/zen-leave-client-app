import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../services/models/user.model';
import { Leave } from '../services/models/leave.model';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LeavesService } from '../services/leaves.service';
import { ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-all-leaves',
  templateUrl: './all-leaves.page.html',
  styleUrls: ['./all-leaves.page.scss'],
})
export class AllLeavesPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  allLeaves: Leave[] = [];
  allUsers: User[] = [];

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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

            this.loadAllLeaves();
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
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  leaveDateFormatted(leave: Leave): { start: string; end: string | null } {
    let start = '';
    let end = null;

    if (leave) {
      if (
        new Date(new Date(leave?.startDate).setHours(4))
          .setMinutes(20)
          .valueOf() ===
        new Date(new Date(leave?.endDate).setHours(4)).setMinutes(20).valueOf()
      ) {
        if (leave?.startDateDayPart === leave?.endDateDayPart) {
          start = `Le ${formatDate(
            <string>leave?.startDate,
            'dd/MM/YYYY',
            'en',
          )} <br class="ion-hide-lg-up"/>${
            leave?.startDateDayPart === 'morning'
              ? 'uniquement le matin'
              : `uniquement l'après-midi`
          }`;
        } else {
          start = `Le ${formatDate(
            <string>leave?.startDate,
            'dd/MM/YYYY',
            'en',
          )} <br class="ion-hide-lg-up"/>toute la journée`;
        }
      } else {
        start = `Du ${formatDate(
          <string>leave?.startDate,
          'dd/MM/YYYY',
          'en',
        )} <br class="ion-hide-lg-up"/>${
          leave?.startDateDayPart === 'morning' ? 'matin' : `après-midi`
        }`;

        end = `Jusqu'au ${formatDate(
          <string>leave?.endDate,
          'dd/MM/YYYY',
          'en',
        )} <br class="ion-hide-lg-up"/>${
          leave?.endDateDayPart === 'morning' ? 'matin' : `après-midi`
        }`;
      }
    }

    return { start, end };
  }

  loadAllLeaves(): void {
    if (this.currentUser) {
      this.leavesService
        .allLeaves()
        .pipe(take(1))
        .subscribe({
          next: (allLeaves) => {
            if (allLeaves) {
              this.allUsers = allLeaves?.users;
              this.allLeaves = allLeaves?.leaves
                ?.filter((leave) =>
                  this.currentUser?.role === 'STAFF'
                    ? this.allUsers.find((user) => user?.id === leave?.userID)
                        ?.role === 'USER' &&
                      leave?.userID !== this.currentUser?.id
                    : leave?.userID !== this.currentUser?.id,
                )
                .sort(
                  (leave1, leave2) =>
                    new Date(leave1?.startDate).valueOf() -
                    new Date(leave2?.startDate).valueOf(),
                );
            }
          },
        });
    }
  }

  validationStatusChipColor(leave: Leave): string {
    if (leave?.validated === null) {
      return 'danger';
    } else if (leave?.validated === false) {
      return 'warning';
    } else {
      return 'success';
    }
  }

  validationStatusLabel(leave: Leave): string {
    if (leave?.validated === null) {
      return `À soumetre pour validation`;
    } else if (leave?.validated === false) {
      return `En attente de validation`;
    } else {
      return `Validée`;
    }
  }

  validationStatusIcon(leave: Leave): string {
    if (leave?.validated === null) {
      return `ellipse-outline`;
    } else if (leave?.validated === false) {
      return `hourglass-outline`;
    } else {
      return `checkmark-outline`;
    }
  }

  userNameByID(userID: string | undefined): string | null {
    const teamUser = this.allUsers.find((user) => user?.id === userID);

    if (
      (<string>teamUser?.firstName)?.length > 0 ||
      (<string>teamUser?.lastName)?.length > 0
    ) {
      if (
        (<string>teamUser?.firstName)?.length > 0 &&
        (<string>teamUser?.lastName)?.length > 0
      ) {
        return `${teamUser?.firstName} ${teamUser?.lastName} <em>(${teamUser?.email})</em>`;
      } else {
        if ((<string>teamUser?.firstName)?.length > 0) {
          return `${teamUser?.firstName || ''} <em>(${teamUser?.email})</em>`;
        } else {
          return `${teamUser?.lastName || ''} <em>(${teamUser?.email})</em>`;
        }
      }
    } else if ((<string>teamUser?.email)?.length > 0) {
      return teamUser?.email || '';
    } else {
      return '';
    }
  }
}
