import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import Order from '@modules/orders/infra/typeorm/entities/Order';
import Product from '@modules/products/infra/typeorm/entities/Product';

@Entity('orders_products')
class OrdersProducts {

  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(type => Order, order => order.order_products)
  order: Order;

  @ManyToOne(type => Product, product => product.order_products)
  product: Product;

  @Column({ name: 'productId' })
  product_id: string;

  @Column({ name: 'orderId' })
  order_id: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrdersProducts;
