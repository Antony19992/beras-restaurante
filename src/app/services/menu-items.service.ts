import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem, CartMenuItem } from '../interfaces/menu-item.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuItemsService {
  private menuItems: MenuItem[] = [
    {
      id: 1,
      title: 'Marmita Tradicional',
      description: 'Arroz, feijão, bife grelhado, salada de alface e tomate',
      price: 18.90,
      imageUrl: 'assets/images/marmita-tradicional.jpg',
      category: 'marmitas',
      ingredients: [
        { name: 'Arroz Branco', selected: true, removable: true },
        { name: 'Feijão Carioca', selected: true, removable: true },
        { name: 'Bife Grelhado', selected: true, removable: true },
        { name: 'Alface', selected: true, removable: true },
        { name: 'Tomate', selected: true, removable: true }
      ]
    },
    {
      id: 2,
      title: 'Marmita Fitness',
      description: 'Arroz integral, frango grelhado, legumes no vapor',
      price: 22.90,
      imageUrl: 'assets/images/marmita-fitness.jpg',
      category: 'marmitas',
      ingredients: [
        { name: 'Arroz Integral', selected: true, removable: true },
        { name: 'Frango Grelhado', selected: true, removable: true },
        { name: 'Brócolis no Vapor', selected: true, removable: true },
        { name: 'Cenoura no Vapor', selected: true, removable: true },
        { name: 'Abobrinha no Vapor', selected: true, removable: true }
      ]
    },
    {
      id: 3,
      title: 'Refrigerante Coca-Cola',
      description: 'Lata 350ml',
      price: 5.00,
      imageUrl: 'assets/images/coca-cola.jpg',
      category: 'bebidas'
    },
    {
      id: 4,
      title: 'Suco Natural de Laranja',
      description: 'Copo 500ml',
      price: 7.00,
      imageUrl: 'assets/images/suco-laranja.jpg',
      category: 'bebidas'
    },
    {
      id: 5,
      title: 'Pudim de Leite',
      description: 'Pudim caseiro com calda de caramelo',
      price: 8.00,
      imageUrl: 'assets/images/pudim.jpg',
      category: 'sobremesas',
      ingredients: [
        { name: 'Leite Condensado', selected: true, removable: false },
        { name: 'Leite', selected: true, removable: false },
        { name: 'Ovos', selected: true, removable: false },
        { name: 'Calda de Caramelo', selected: true, removable: true }
      ]
    },
    {
      id: 6,
      title: 'Mousse de Chocolate',
      description: 'Mousse cremoso de chocolate meio amargo',
      price: 7.50,
      imageUrl: 'assets/images/mousse.jpg',
      category: 'sobremesas',
      ingredients: [
        { name: 'Chocolate Meio Amargo', selected: true, removable: false },
        { name: 'Creme de Leite', selected: true, removable: false },
        { name: 'Raspas de Chocolate', selected: true, removable: true }
      ]
    },
    {
      id: 7,
      title: 'Combo Executivo',
      description: 'Marmita tradicional + Refrigerante + Sobremesa',
      price: 29.90,
      imageUrl: 'assets/images/combo-executivo.jpg',
      category: 'combos',
      ingredients: [
        { name: 'Marmita Tradicional', selected: true, removable: false },
        { name: 'Refrigerante 350ml', selected: true, removable: true },
        { name: 'Pudim de Leite', selected: true, removable: true }
      ]
    }
  ];

  private cartItems = new BehaviorSubject<CartMenuItem[]>([]);

  constructor() {}

  getMenuItems(): MenuItem[] {
    return this.menuItems;
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
