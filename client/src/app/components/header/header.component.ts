import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, RouterLink, NgIf],
  standalone: true,
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  get isLogged(): boolean {
    return localStorage.getItem('zl-user-token') !== null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('zl-user-token');
    await this.router.navigate(['/login']);
  }
}
