import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../services/models/user.model';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit, OnDestroy {
  currentUser: User | null = null;
  profileForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    internal: new FormControl(null),
  });

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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

            this.profileForm.patchValue({
              email: this.currentUser?.email,
              firstName: this.currentUser?.firstName,
              lastName: this.currentUser?.lastName,
              internal: this.currentUser?.internal,
            });
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

  get roleLabel(): string | null {
    return (
      {
        SUPER_ADMIN: 'Super-Administrateur',
        ADMIN: 'Administrateur',
        STAFF: 'Staff',
        USER: 'Utilisateur',
      }[<string>this.currentUser?.role] || null
    );
  }

  get roleChipColor(): string | null {
    return (
      {
        SUPER_ADMIN: 'success',
        ADMIN: 'tertiary',
        STAFF: 'secondary',
        USER: 'primary',
      }[<string>this.currentUser?.role] || null
    );
  }

  save(): void {
    this.authService
      .updateUserProfile(this.profileForm.getRawValue())
      .pipe(take(1))
      .subscribe({
        next: async (result) => {
          if (result) {
            localStorage.setItem('zl-user-token', result?.token);
            this.currentUser = result?.user;

            this.profileForm.reset({
              email: this.currentUser?.email,
              firstName: this.currentUser?.firstName,
              lastName: this.currentUser?.lastName,
              internal: this.currentUser?.internal,
            });

            if (await this.toastController.getTop()) {
              await this.toastController.dismiss();
            }

            const toast = await this.toastController.create({
              message: `Profil mis à jour`,
              duration: 3000,
              position: 'bottom',
              color: 'success',
            });

            await toast.present();
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
}
