import { Component, OnInit } from '@angular/core';
import { MenuItem, Ingredient } from '../../interfaces/menu-item.interface';
import { MenuItemsService } from '../../services/menu-items.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ItemCustomizationDialogComponent } from './item-customization-dialog/item-customization-dialog.component';

@Component({
  selector: 'app-menu-items',
  templateUrl: './menu-items.component.html',
  styleUrls: ['./menu-items.component.scss']
})
export class MenuItemsComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(
    private menuItemsService: MenuItemsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.menuItems = this.menuItemsService.getMenuItems();
  }

  openCustomizationDialog(item: MenuItem): void {
    const dialogRef = this.dialog.open(ItemCustomizationDialogComponent, {
      width: '400px',
      data: {
        item: { ...item },
        ingredients: item.ingredients?.map(ing => ({ ...ing })) || []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const removedIngredients = result.ingredients
          .filter((ing: Ingredient) => !ing.selected)
          .map((ing: Ingredient) => ing.name);

        this.menuItemsService.addToCart(item, removedIngredients, result.observations);
        this.snackBar.open(`${item.title} adicionado ao carrinho!`, 'OK', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom'
        });
      }
    });
  }
}
