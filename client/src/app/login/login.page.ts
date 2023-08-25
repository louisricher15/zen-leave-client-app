import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { delay, Subject, take, takeUntil } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  loginForm: FormGroup = new FormGroup({});
  securityCodeForm: FormGroup = new FormGroup({});

  showSecurityCodeForm = false;
  sendingSecurityCode = false;
  loggingIn = false;

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });
    this.securityCodeForm = this.formBuilder.group({
      code: new FormControl(null, [Validators.required]),
    });

    this.activatedRoute.url
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async () => {
        if (localStorage.getItem('zl-user-token')) {
          await this.router.navigate(['/home']);
        }

        this.showSecurityCodeForm = false;
        this.sendingSecurityCode = false;
        this.loggingIn = false;

        this.loginForm.reset();
        this.securityCodeForm.reset();
      });
  }

  ngOnDestroy() {
    this.showSecurityCodeForm = false;
    this.sendingSecurityCode = false;
    this.loggingIn = false;

    this.loginForm.reset();
    this.securityCodeForm.reset();

    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  sendSecurityCode(): void {
    if (this.loginForm.valid) {
      this.sendingSecurityCode = true;

      this.authService
        .sendSecurityCode(this.loginForm.get('email')?.value)
        .pipe(take(1))
        .subscribe({
          next: async (isSecurityCodeSent) => {
            this.showSecurityCodeForm = isSecurityCodeSent;

            this.sendingSecurityCode = true;

            if (this.showSecurityCodeForm) {
              if (await this.toastController.getTop()) {
                await this.toastController.dismiss();
              }

              const toast = await this.toastController.create({
                message: `Vous allez recevoir un code de sécurité sur l'adresse '${this.loginForm.get(
                  'email',
                )?.value}'.`,
                duration: 3000,
                position: 'bottom',
                color: 'success',
              });

              await toast.present();
            }
          },
          error: async () => {
            this.sendingSecurityCode = true;

            if (await this.toastController.getTop()) {
              await this.toastController.dismiss();
            }

            const toast = await this.toastController.create({
              message: `Une erreur est survenue lors de l'envoi du code de sécurité`,
              duration: 3000,
              position: 'bottom',
              color: 'danger',
            });

            await toast.present();
          },
        });
    }
  }

  login(): void {
    if (this.securityCodeForm.valid) {
      this.loggingIn = true;

      this.authService
        .login(
          this.loginForm.get('email')?.value,
          this.securityCodeForm.get('code')?.value,
        )
        .pipe(delay(800), take(1))
        .subscribe({
          next: async (token) => {
            if (token) {
              this.loggingIn = false;

              if (await this.toastController.getTop()) {
                await this.toastController.dismiss();
              }

              const toast = await this.toastController.create({
                message: `Connexion réussie`,
                duration: 3000,
                position: 'bottom',
                color: 'success',
              });

              await toast.present();

              localStorage.setItem('zl-user-token', token);

              await this.router.navigate(['/home']);
            }
          },
          error: async () => {
            this.loggingIn = false;

            if (await this.toastController.getTop()) {
              await this.toastController.dismiss();
            }

            const toast = await this.toastController.create({
              message: `Une erreur est survenue lors de la connexion`,
              duration: 3000,
              position: 'bottom',
              color: 'danger',
            });

            await toast.present();
          },
        });
    }
  }
}
