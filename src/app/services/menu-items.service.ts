import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem, CartMenuItem } from '../interfaces/menu-item.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuItemsService {

  private cartItems = new BehaviorSubject<CartMenuItem[]>([]);

  constructor(private http: HttpClient) {}

  // Função para buscar produtos do backend
  getProducts(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/products`);
  }

  getCartItems(): Observable<CartMenuItem[]> {
    return this.cartItems.asObservable();
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems.asObservable().pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  addToCart(item: MenuItem, removedIngredients: string[] = [], observations: string = ''): void {
    const currentItems = this.cartItems.value;
    
    console.log('Adding to cart:', {
      item,
      removedIngredients,
      observations
    });
    
    // Check if the item already exists in the cart with the same removed ingredients
    const existingItemIndex = currentItems.findIndex(cartItem => 
      cartItem.id === item.id && 
      JSON.stringify(cartItem.removedIngredients?.sort()) === JSON.stringify(removedIngredients.sort()) &&
      cartItem.observations === observations
    );

    if (existingItemIndex !== -1) {
      // If item exists with same customizations, increment quantity
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += 1;
      this.cartItems.next(updatedItems);
    } else {
      // If item doesn't exist or has different customizations, add as new item
      const cartItem: CartMenuItem = {
        ...item,
        quantity: 1,
        removedIngredients: removedIngredients,
        observations: observations
      };
      this.cartItems.next([...currentItems, cartItem]);
    }
  }

  removeFromCart(itemId: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.cartItems.next(updatedItems);
  }

  clearCart(): void {
    this.cartItems.next([]);
  }
}
