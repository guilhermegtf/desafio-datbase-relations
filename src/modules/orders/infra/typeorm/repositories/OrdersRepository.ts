import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;

  constructor() {
    this.ormRepository = getRepository(Order);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const final = products.map(e => {
      return {
        ...e,
        id: e.product_id
      }
    })
    const order = this.ormRepository.create({ customer, order_products: final });
    const savedOrder = await this.ormRepository.save(order);
    return savedOrder;
  }

  public async findById(id: string): Promise<Order | undefined> {
    return this.ormRepository.findOne({ id }, { loadEagerRelations: true });
  }
}

export default OrdersRepository;
