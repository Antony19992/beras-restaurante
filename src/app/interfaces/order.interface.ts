import { CartMenuItem } from './menu-item.interface';

export interface Order {
  id: number;
  items: CartMenuItem[];
  total: number;
  status: OrderStatus;
  date: Date;
  estimatedTime?: number; // tempo estimado em minutos
}

export enum OrderStatus {
  PENDING = 'PENDENTE',
  PREPARING = 'EM PREPARO',
  READY = 'PRONTO',
  DELIVERED = 'ENTREGUE'
}
