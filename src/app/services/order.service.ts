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
    // Simular alguns pedidos anteriores
    const mockOrders: Order[] = [
      {
        id: 1001,
        items: [
          {
            id: 1,
            title: 'X-Burger Especial',
            description: 'Hambúrguer artesanal, queijo cheddar, alface, tomate e molho especial',
            price: 25.90,
            imageUrl: 'assets/images/burger.jpg',
            quantity: 2
          }
        ],
        total: 51.80,
        status: OrderStatus.DELIVERED,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 dia atrás
      },
      {
        id: 1002,
        items: [
          {
            id: 2,
            title: 'Pizza Margherita',
            description: 'Molho de tomate, mussarela, manjericão fresco e azeite',
            price: 45.90,
            imageUrl: 'assets/images/pizza.jpg',
            quantity: 1
          }
        ],
        total: 45.90,
        status: OrderStatus.DELIVERED,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 dias atrás
      }
    ];

    this.orders.next(mockOrders);
  }

  createOrder(items: CartMenuItem[], total: number): Order {
    const newOrder: Order = {
      id: Math.floor(Math.random() * 9000) + 1000, // Gera um número entre 1000 e 9999
      items,
      total,
      status: OrderStatus.PENDING,
      date: new Date(),
      estimatedTime: 30 // 30 minutos de tempo estimado
    };

    const currentOrders = this.orders.value;
    this.orders.next([newOrder, ...currentOrders]);
    this.currentOrder.next(newOrder);

    // Simular mudanças de status
    setTimeout(() => this.updateOrderStatus(newOrder.id, OrderStatus.PREPARING), 5000);
    setTimeout(() => this.updateOrderStatus(newOrder.id, OrderStatus.READY), 15000);

    return newOrder;
  }

  private updateOrderStatus(orderId: number, status: OrderStatus): void {
    const currentOrders = this.orders.value;
    const updatedOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    });

    this.orders.next(updatedOrders);
    
    if (this.currentOrder.value?.id === orderId) {
      this.currentOrder.next({ ...this.currentOrder.value, status });
    }
  }

  getOrders(): Observable<Order[]> {
    return this.orders.asObservable();
  }

  getCurrentOrder(): Observable<Order | null> {
    return this.currentOrder.asObservable();
  }

  clearCurrentOrder(): void {
    this.currentOrder.next(null);
  }
}
