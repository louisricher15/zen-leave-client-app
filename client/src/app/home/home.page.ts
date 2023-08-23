import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  currentUser: User | null = null;

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
