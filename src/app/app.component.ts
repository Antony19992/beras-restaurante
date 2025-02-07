import { Component } from '@angular/core';
import { ThemeService } from './theme.service';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isDarkMode = false;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isDarkMode = localStorage.getItem('dark-mode') === 'true';
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }
}
