import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MenuItem } from '../../../interfaces/menu-item.interface';
import { Ingredient } from 'src/app/interfaces/ingredient.interface';

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
  ) {
    // Inicializar ingredientes como selecionados (mantidos)
    if (this.data.ingredients) {
      this.data.ingredients = this.data.ingredients.map(ingredient => ({
        ...ingredient,
        selected: true // Inicialmente todos os ingredientes estão selecionados (mantidos)
      }));
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleIngredient(ingredient: Ingredient): void {
    if (ingredient.removable) {
      ingredient.selected = !ingredient.selected;
      console.log('Toggled ingredient:', ingredient.descricao, 'Selected:', ingredient.selected);
    }
  }

  onConfirm(): void {
    // Envia os ingredientes que NÃO estão selecionados (serão removidos)
    const removedIngredients = this.data.ingredients
      .filter(i => !i.selected && i.removable)
      .map(i => i.descricao);

    console.log('Removed ingredients:', removedIngredients);

    this.dialogRef.close({
      removedIngredients: removedIngredients,
      observations: this.observations
    });
  }
}
