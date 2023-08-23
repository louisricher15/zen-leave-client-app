import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';
import { User } from '../../services/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, RouterLink, NgIf, JsonPipe],
  standalone: true,
})
export class HeaderComponent {
  @Input() currentUser: User | null = null;

  constructor(private router: Router) {}

  async logout(): Promise<void> {
    localStorage.removeItem('zl-user-token');
    await this.router.navigate(['/login']);
  }

  get userName(): string | null {
    if (
      (<string>this.currentUser?.firstName)?.length > 0 ||
      (<string>this.currentUser?.lastName)?.length > 0
    ) {
      if (
        (<string>this.currentUser?.firstName)?.length > 0 &&
        (<string>this.currentUser?.lastName)?.length > 0
      ) {
        return `${this.currentUser?.firstName} ${this.currentUser?.lastName}`;
      } else {
        if ((<string>this.currentUser?.firstName)?.length > 0) {
          return this.currentUser?.firstName || null;
        } else {
          return this.currentUser?.lastName || null;
        }
      }
    } else if ((<string>this.currentUser?.email)?.length > 0) {
      return this.currentUser?.email || null;
    } else {
      return '';
    }
  }
}
