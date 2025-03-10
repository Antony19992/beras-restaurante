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

  constructor(
    private menuItemsService: MenuItemsService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.menuItemsService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
      printOutput += `${item.quantity}x ${item.title}\n`;
      printOutput += `   Preço un.: R$ ${item.price.toFixed(2)}\n`;
      printOutput += `   Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
      
      // Adiciona os ingredientes removidos e observações se houver
      const hasRemovedIngredients = item.removedIngredients && item.removedIngredients.length > 0;
      const hasObservations = item.observations && item.observations.trim().length > 0;
      
      console.log('Item customizations:', {
        item: item.title,
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
    printOutput += `Total: R$ ${this.total.toFixed(2)}\n\n`;
    printOutput += '='.repeat(40) + '\n';
    printOutput += '            Bom apetite!               \n';
    printOutput += '='.repeat(40) + '\n';
    
    return printOutput;
  }

  checkout(): void {
    const printOutput = this.formatOrderForPrinting();
    console.log(printOutput);

    // Criar pedido no histórico
    this.orderService.createOrder(this.cartItems, this.total);

    this.menuItemsService.clearCart();
    this.snackBar.open('Pedido realizado com sucesso!', 'OK', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    });
    this.router.navigate(['/home']);
  }
}
