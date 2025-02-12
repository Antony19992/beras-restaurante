import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartMenuItem } from '../../interfaces/menu-item.interface';
import { MenuItemsService } from '../../services/menu-items.service';
import { OrderService } from '../../services/order.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartMenuItem[] = [];
  total: number = 0;
  selectedPaymentMethod: string | null = null;
  amountPaid: number | null = null;
  change: number | null = null;
  clienteId: string = ''; // assuming userId is defined somewhere in your code

  constructor(
    private menuItemsService: MenuItemsService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.clienteId = sessionStorage.getItem('clienteId') || '';
  }

  ngOnInit(): void {
    this.menuItemsService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.valor * item.quantity), 0);
  }

  updateQuantity(item: CartMenuItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      item.quantity = newQuantity;
      this.calculateTotal();
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: CartMenuItem): void {
    this.menuItemsService.removeFromCart(item.id);
    this.calculateTotal();
  }

  continueShopping(): void {
    this.router.navigate(['/cardapio']);
  }

  private formatOrderForPrinting(): string {
    const currentDate = new Date();
    const orderNumber = Math.floor(Math.random() * 10000);

    let printOutput = '\n';
    printOutput += '='.repeat(40) + '\n';
    printOutput += '           BERAS MARMITARIA           \n';
    printOutput += '='.repeat(40) + '\n\n';

    printOutput += `Data: ${currentDate.toLocaleDateString()}\n`;
    printOutput += `Hora: ${currentDate.toLocaleTimeString()}\n`;
    printOutput += `Pedido #${orderNumber}\n`;
    printOutput += '-'.repeat(40) + '\n\n';

    printOutput += 'ITENS DO PEDIDO:\n';
    printOutput += '-'.repeat(40) + '\n';

    console.log('Cart items for printing:', this.cartItems);

    this.cartItems.forEach(item => {
      printOutput += `${item.quantity}x ${item.nome}\n`;
      printOutput += `   Preço un.: R$ ${item.valor.toFixed(2)}\n`;
      printOutput += `   Subtotal: R$ ${(item.valor * item.quantity).toFixed(2)}\n`;

      // Adiciona os ingredientes removidos e observações se houver
      const hasRemovedIngredients = item.removedIngredients && item.removedIngredients.length > 0;
      const hasObservations = item.observations && item.observations.trim().length > 0;

      console.log('Item customizations:', {
        item: item.nome,
        removedIngredients: item.removedIngredients,
        observations: item.observations
      });

      if (hasRemovedIngredients || hasObservations) {
        printOutput += '   ** Personalização:\n';

        if (hasRemovedIngredients && item.removedIngredients) {
          printOutput += `      Remover: ${item.removedIngredients.join(', ')}\n`;
        }

        if (hasObservations && item.observations) {
          printOutput += `      Obs: ${item.observations.trim()}\n`;
        }
      }

      printOutput += '-'.repeat(40) + '\n';
    });

    printOutput += '\n';
    printOutput += `Subtotal: R$ ${this.total.toFixed(2)}\n`;
    printOutput += `Total: R$ ${this.total.toFixed(2)}\n`;
    printOutput += `Troco: R$ ${this.change !== null ? this.change.toFixed(2) : '0.00'}\n\n`;
    printOutput += '='.repeat(40) + '\n';
    printOutput += '            Bom apetite!               \n';
    printOutput += '='.repeat(40) + '\n';

    return printOutput;
  }

  calculateChange(): void {
    if (this.amountPaid !== null) {
      this.change = this.amountPaid - this.total;
    } else {
      this.change = null;
    }
  }

  checkout(): void {
    const printOutput = this.formatOrderForPrinting();
    console.log(printOutput);

    const orderItems = this.cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));
    this.orderService.createOrderApi(this.clienteId, 1, orderItems).subscribe(response => {
      console.log('Pedido criado com sucesso!', response);
      this.menuItemsService.clearCart();
      this.snackBar.open('Pedido realizado com sucesso!', 'OK', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'bottom'
      });

      if (this.selectedPaymentMethod === 'pix') {
        this.router.navigate(['/pix-payment'], { queryParams: { total: this.total } });
      } else {
        this.router.navigate(['/home']);
      }
    }, error => {
      console.error('Erro ao criar pedido', error);
    });
  }
}
