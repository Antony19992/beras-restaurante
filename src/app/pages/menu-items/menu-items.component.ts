import { Component, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem } from '../../interfaces/menu-item.interface';
import { MenuItemsService } from '../../services/menu-items.service';
import { ItemCustomizationDialogComponent } from './item-customization-dialog/item-customization-dialog.component';

interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit {
  menuItems: MenuItem[] = [];
  selectedCategory: string = 'marmitas';
  showScrollTop: boolean = false;

  categories: MenuCategory[] = [
    { id: 'marmitas', name: 'Marmitas', icon: 'restaurant' },
    { id: 'bebidas', name: 'Bebidas', icon: 'local_bar' },
    { id: 'sobremesas', name: 'Sobremesas', icon: 'cake' },
    { id: 'combos', name: 'Combos', icon: 'fastfood' }
  ];

  constructor(
    private menuItemsService: MenuItemsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.menuItems = this.menuItemsService.getMenuItems();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.showScrollTop = window.pageYOffset > 300;
    this.updateSelectedCategory();
  }

  scrollToCategory(categoryId: string) {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.selectedCategory = categoryId;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getItemsByCategory(categoryId: string): MenuItem[] {
    return this.menuItems.filter(item => item.category === categoryId);
  }

  getIngredientsText(item: MenuItem): string {
    if (!item.ingredients?.length) return '';
    return item.ingredients.map(i => i.name).join(', ');
  }

  private updateSelectedCategory() {
    const sections = this.categories.map(cat => ({
      id: cat.id,
      element: document.getElementById(cat.id)
    })).filter(section => section.element);

    for (const section of sections) {
      const element = section.element;
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          this.selectedCategory = section.id;
          break;
        }
      }
    }
  }

  openCustomizationDialog(item: MenuItem): void {
    const dialogRef = this.dialog.open(ItemCustomizationDialogComponent, {
      width: '500px',
      data: { 
        item,
        ingredients: item.ingredients || []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.menuItemsService.addToCart(
          item,
          result.ingredients?.filter((i: any) => !i.selected).map((i: any) => i.name) || [],
          result.observations
        );
      }
    });
  }
}
