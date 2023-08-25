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

@Component({
  selector: 'app-leave-creation',
  templateUrl: './leave-creation.page.html',
  styleUrls: ['./leave-creation.page.scss'],
})
export class LeaveCreationPage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  creating = false;
  leaveCreationForm: FormGroup = new FormGroup({});

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

  isStartDateEnabled(date: string): boolean {
    return (
      new Date(new Date().setHours(4)).setMinutes(20).valueOf() -
        new Date(new Date(date).setHours(4)).setMinutes(20).valueOf() <=
      24 * 60 * 60 * 1000
    );
  }
}
