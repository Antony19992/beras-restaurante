import { Injectable } from '@angular/core';
import { MenuItem, CartMenuItem, Ingredient } from '../interfaces/menu-item.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuItemsService {
  private items: MenuItem[] = [
    {
      id: 1,
      title: 'X-Burger Especial',
      description: 'Hambúrguer artesanal, queijo cheddar, alface, tomate e molho especial',
      price: 25.90,
      imageUrl: 'assets/images/burger.jpg',
      ingredients: [
        { id: 1, name: 'Hambúrguer artesanal', removable: false, selected: true },
        { id: 2, name: 'Queijo cheddar', removable: true, selected: true },
        { id: 3, name: 'Alface', removable: true, selected: true },
        { id: 4, name: 'Tomate', removable: true, selected: true },
        { id: 5, name: 'Cebola', removable: true, selected: true },
        { id: 6, name: 'Molho especial', removable: true, selected: true }
      ]
    },
    {
      id: 2,
      title: 'Pizza Margherita',
      description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
      price: 45.90,
      imageUrl: 'assets/images/pizza.jpg',
      ingredients: [
        { id: 7, name: 'Molho de tomate', removable: false, selected: true },
        { id: 8, name: 'Mussarela', removable: true, selected: true },
        { id: 9, name: 'Manjericão', removable: true, selected: true },
        { id: 10, name: 'Azeite', removable: true, selected: true }
      ]
    },
    {
      id: 3,
      title: 'Salada Caesar',
      description: 'Alface romana, croutons, parmesão e molho caesar',
      price: 28.90,
      imageUrl: 'assets/images/salad.jpg',
      ingredients: [
        { id: 11, name: 'Alface romana', removable: false, selected: true },
        { id: 12, name: 'Croutons', removable: true, selected: true },
        { id: 13, name: 'Parmesão', removable: true, selected: true },
        { id: 14, name: 'Molho caesar', removable: true, selected: true }
      ]
    },
    {
      id: 4,
      title: 'Pasta Carbonara',
      description: 'Espaguete, ovos, queijo pecorino, pancetta e pimenta preta',
      price: 38.90,
      imageUrl: 'assets/images/pasta.jpg',
      ingredients: [
        { id: 15, name: 'Espaguete', removable: false, selected: true },
        { id: 16, name: 'Ovos', removable: true, selected: true },
        { id: 17, name: 'Queijo pecorino', removable: true, selected: true },
        { id: 18, name: 'Pancetta', removable: true, selected: true },
        { id: 19, name: 'Pimenta preta', removable: true, selected: true }
      ]
    }
  ];

  private cartItems = new BehaviorSubject<CartMenuItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  getMenuItems(): MenuItem[] {
    return this.items;
  }

  addToCart(item: MenuItem, removedIngredients?: string[], observations?: string): void {
    const cartItem: CartMenuItem = {
      ...item,
      quantity: 1,
      removedIngredients,
      observations
    };

    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      i => i.id === item.id && 
      JSON.stringify(i.removedIngredients) === JSON.stringify(removedIngredients) &&
      i.observations === observations
    );

    if (existingItemIndex !== -1) {
      currentItems[existingItemIndex].quantity++;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, cartItem]);
    }
  }

  removeFromCart(itemId: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
  }

  removeOneFromCart(itemId: number): void {
    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
      const item = currentItems[itemIndex];
      if (item.quantity > 1) {
        item.quantity--;
        this.cartItems.next([...currentItems]);
      } else {
        this.removeFromCart(itemId);
      }
    }
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  getCartItems(): Observable<CartMenuItem[]> {
    return this.cartItems$;
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems$.pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }
}
