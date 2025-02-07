import { Component } from '@angular/core';
import { ThemeService } from 'src/app/theme.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuItemsService } from 'src/app/services/menu-items.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isDarkMode = false;
  cartItemCount = 0;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private menuItemsService: MenuItemsService
  ) {
    this.isDarkMode = localStorage.getItem('dark-mode') === 'true';
    this.menuItemsService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);
  }

  logout(): void {
    this.authService.logout();
  }
}
