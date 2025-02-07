import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly themeKey = 'dark-mode';

  constructor() {
    const isDark = localStorage.getItem(this.themeKey) === 'true';
    this.setDarkMode(isDark);
  }

  setDarkMode(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(this.themeKey, isDark.toString());
  }

  toggleDarkMode(): void {
    const isDark = document.body.classList.contains('dark-mode');
    this.setDarkMode(!isDark);
  }
}
