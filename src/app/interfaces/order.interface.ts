import { CartMenuItem, MenuItem } from './menu-item.interface';

export interface Order {
  id: number;
  clienteId?: number;
  status: OrderStatus;
  numero?: string;
  dataHora?: string;
  itens: CartMenuItem[];
  produtos?: MenuItem[];
  total: number;
  troco?: number | null;
  createdAt?: string;
  updatedAt?: string;
  date?: Date;
  estimatedTime?: number;
}

export enum OrderStatus {
  PENDING = 'PENDENTE',
  PREPARING = 'EM PREPARO',
  READY = 'PRONTO',
  DELIVERED = 'ENTREGUE'
}
