import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../services/models/user.model';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Leave } from '../services/models/leave.model';
import { LeavesService } from '../services/leaves.service';
import { ToastController } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-my-leaves',
  templateUrl: './my-leaves.page.html',
  styleUrls: ['./my-leaves.page.scss'],
})
export class MyLeavesPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  myLeaves: Leave[] = [];

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

  loadMyLeaves(): void {
    if (this.currentUser) {
      this.leavesService
        .myLeaves(this.currentUser?.id)
        .pipe(take(1))
        .subscribe({
          next: (myLeaves) => {
            if (myLeaves) {
              this.myLeaves = myLeaves.sort(
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
    if (leave?.validationStatus === 'rejected') {
      return 'danger';
    } else if (leave?.validationStatus === 'submitted-for-validation') {
      return 'warning';
    } else if (leave?.validationStatus === 'validated') {
      return 'success';
    } else {
      return 'medium';
    }
  }

  validationStatusLabel(leave: Leave): string {
    if (leave?.validationStatus === 'rejected') {
      return `Rejetée`;
    } else if (leave?.validationStatus === 'submitted-for-validation') {
      return `En attente de validation`;
    } else if (leave?.validationStatus === 'validated') {
      return `Validée`;
    } else {
      return `À soumettre pour validation`;
    }
  }

  validationStatusIcon(leave: Leave): string {
    if (leave?.validationStatus === 'rejected') {
      return `close-outline`;
    } else if (leave?.validationStatus === 'submitted-for-validation') {
      return `hourglass-outline`;
    } else if (leave?.validationStatus === 'validated') {
      return `checkmark-outline`;
    } else {
      return `ellipse-outline`;
    }
  }
}
