import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderStatus } from '../interfaces/order.interface';
import { CartMenuItem } from '../interfaces/menu-item.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders = new BehaviorSubject<Order[]>([]);

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
