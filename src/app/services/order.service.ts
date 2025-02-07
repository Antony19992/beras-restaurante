import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderStatus } from '../interfaces/order.interface';
import { CartMenuItem } from '../interfaces/menu-item.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = new BehaviorSubject<Order[]>([
    {
      id: 1001,
      date: new Date('2025-02-07T10:30:00'),
      status: OrderStatus.DELIVERED,
      total: 47.80,
      items: [
        {
          id: 1,
          title: 'Marmita Tradicional',
          description: 'Arroz, feijão, bife grelhado, salada de alface e tomate',
          price: 18.90,
          imageUrl: 'assets/images/marmita-tradicional.jpg',
          category: 'marmitas',
          quantity: 2
        }
      ]
    },
    {
      id: 1002,
      date: new Date('2025-02-07T11:15:00'),
      status: OrderStatus.PREPARING,
      total: 22.90,
      items: [
        {
          id: 2,
          title: 'Marmita Fitness',
          description: 'Arroz integral, frango grelhado, legumes no vapor',
          price: 22.90,
          imageUrl: 'assets/images/marmita-fitness.jpg',
          category: 'marmitas',
          quantity: 1
        }
      ]
    }
  ]);

  private currentOrder = new BehaviorSubject<Order | null>(null);

  constructor() {
    // Simular atualização do pedido atual após 5 segundos
    setTimeout(() => {
      const lastOrder = this.orders.value[this.orders.value.length - 1];
      if (lastOrder) {
        this.currentOrder.next(lastOrder);
      }
    }, 5000);
  }

  getOrders(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  getCurrentOrder(): Observable<Order | null> {
    return this.currentOrder.asObservable();
  }

  createOrder(items: CartMenuItem[], total: number): void {
    const newOrder: Order = {
      id: Math.floor(1000 + Math.random() * 9000), // ID de 4 dígitos
      date: new Date(),
      status: OrderStatus.PENDING,
      items,
      total
    };

    const currentOrders = this.orders.value;
    this.orders.next([...currentOrders, newOrder]);
    this.currentOrder.next(newOrder);

    // Simular mudança de status após alguns segundos
    setTimeout(() => {
      newOrder.status = OrderStatus.PREPARING;
      this.orders.next([...this.orders.value]);
    }, 30000);

    setTimeout(() => {
      newOrder.status = OrderStatus.READY;
      this.orders.next([...this.orders.value]);
    }, 60000);

    setTimeout(() => {
      newOrder.status = OrderStatus.DELIVERED;
      this.orders.next([...this.orders.value]);
      this.currentOrder.next(null);
    }, 90000);
  }
}
