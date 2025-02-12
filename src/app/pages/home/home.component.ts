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
    const cliente = this.authService.getLoggedInUser(); // Obter cliente
    const clienteId = cliente ? cliente.id : '';

    if (clienteId) {
        this.orderService.getOrdersByCustomer(clienteId).subscribe(
            (data) => {
                this.orderHistory = Array.isArray(data) ? data : [data];
            },
            (error) => {
                console.error('Erro ao buscar pedidos:', error);
            }
        );
    } else {
        console.error('ID do cliente não encontrado.');
    }
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

  returnQuantity(idProduto: number, idPedido: number) {
    const pedido = this.orderHistory.find(p => p.id === idPedido);

    if (!pedido) return 0;

    const item = pedido.itens.find(i => i.productId === idProduto);

    return item ? item.quantity : 0;
  }

}
