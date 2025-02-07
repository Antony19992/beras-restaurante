import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuItem, Ingredient } from '../../../interfaces/menu-item.interface';

interface DialogData {
  item: MenuItem;
  ingredients: Ingredient[];
}

@Component({
  selector: 'app-item-customization-dialog',
  templateUrl: './item-customization-dialog.component.html',
  styleUrls: ['./item-customization-dialog.component.scss']
})
export class ItemCustomizationDialogComponent {
  observations: string = '';

  constructor(
    public dialogRef: MatDialogRef<ItemCustomizationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleIngredient(ingredient: Ingredient): void {
    if (ingredient.removable) {
      ingredient.selected = !ingredient.selected;
    }
  }

  onConfirm(): void {
    this.dialogRef.close({
      ingredients: this.data.ingredients,
      observations: this.observations
    });
  }
}
