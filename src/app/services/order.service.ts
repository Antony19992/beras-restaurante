import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Order, OrderStatus } from '../interfaces/order.interface';
import { CartMenuItem } from '../interfaces/menu-item.interface';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/pedidos';
  private orders = new BehaviorSubject<Order[]>([]);
  private currentOrder = new BehaviorSubject<Order | null>(null);

  constructor(private http: HttpClient) {
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
      id: Math.floor(1000 + Math.random() * 9000),
      date: new Date(),
      status: OrderStatus.PENDING,
      itens: items,
      total,
      troco: null // implementar logica de troco
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

  createOrderApi(clienteId: string, statusId: number, itens: any[]): Observable<any> {
    const body = { clienteId, statusId, itens };
    return this.http.post(`${environment.apiUrl}${this.apiUrl}`, body);
  }

  getAllOrdersApi(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}${this.apiUrl}`);
  }

  getOrderByIdApi(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}${this.apiUrl}/${id}`);
  }

  updateOrderApi(id: number, body: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}${this.apiUrl}/${id}`, body);
  }

  deleteOrderApi(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${this.apiUrl}/${id}`);
  }

  getOrdersByCustomerApi(clienteId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  getOrdersByCustomer(clienteId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}${this.apiUrl}/${clienteId}`);
}
}
