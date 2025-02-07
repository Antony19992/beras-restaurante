import { Component, OnInit, OnDestroy } from '@angular/core';
import { Order, OrderStatus } from '../../interfaces/order.interface';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentOrder: Order | null = null;
  orderHistory: Order[] = [];
  userName: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obter nome do usuário
    const user = this.authService.getLoggedInUser();
    this.userName = user?.name || 'Visitante';

    // Inscrever-se nas mudanças do pedido atual
    this.subscriptions.push(
      this.orderService.getCurrentOrder().subscribe(order => {
        this.currentOrder = order;
      })
    );

    // Inscrever-se no histórico de pedidos
    this.subscriptions.push(
      this.orderService.getOrders().subscribe(orders => {
        this.orderHistory = orders;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.PREPARING:
        return 'status-preparing';
      case OrderStatus.READY:
        return 'status-ready';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      default:
        return '';
    }
  }

  getStatusIcon(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING:
        return 'schedule';
      case OrderStatus.PREPARING:
        return 'restaurant';
      case OrderStatus.READY:
        return 'check_circle';
      case OrderStatus.DELIVERED:
        return 'done_all';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
}
