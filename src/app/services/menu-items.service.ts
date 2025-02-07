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
      ingredients: ['Arroz', 'Feijão', 'Bife', 'Alface', 'Tomate']
    },
    {
      id: 2,
      title: 'Marmita Fitness',
      description: 'Arroz integral, frango grelhado, legumes no vapor',
      price: 22.90,
      imageUrl: 'assets/images/marmita-fitness.jpg',
      category: 'marmitas',
      ingredients: ['Arroz integral', 'Frango', 'Brócolis', 'Cenoura', 'Abobrinha']
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
      category: 'sobremesas'
    },
    {
      id: 6,
      title: 'Mousse de Chocolate',
      description: 'Mousse cremoso de chocolate meio amargo',
      price: 7.50,
      imageUrl: 'assets/images/mousse.jpg',
      category: 'sobremesas'
    },
    {
      id: 7,
      title: 'Combo Executivo',
      description: 'Marmita tradicional + Refrigerante + Sobremesa',
      price: 29.90,
      imageUrl: 'assets/images/combo-executivo.jpg',
      category: 'combos'
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
    const cartItem: CartMenuItem = {
      ...item,
      quantity: 1,
      removedIngredients,
      observations
    };

    this.cartItems.next([...currentItems, cartItem]);
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
