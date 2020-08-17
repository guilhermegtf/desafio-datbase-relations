import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

export interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository') private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository') private productsRepository: IProductsRepository,
    @inject('CustomersRepository') private customersRepository: ICustomersRepository,
  ) { }

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    if (!customer) {
      throw new AppError(`Customer ${customer_id} not find`);
    }

    const savedProducts = await this.productsRepository.findAllById(products);
    if (savedProducts.length !== products.length) {
      throw new AppError('Some of product has invalid id');
    }

    const insufficientQuantity = savedProducts.filter(savedProduct => {
      const orderProduct = products.find(e => e.id === savedProduct.id);
      return (orderProduct?.quantity || 0) > savedProduct.quantity
    });

    console.log(insufficientQuantity);
    if (insufficientQuantity.length > 0) {
      throw new AppError(`Insufficient quantity for this products: ${insufficientQuantity.map(e => e.name)}`);
    }

    const finalProducts = products.map(pr => {
      const savedProduct = savedProducts.find(svPr => svPr.id === pr.id);
      return {
        product_id: pr.id,
        quantity: pr.quantity,
        price: savedProduct?.price || 0
      }
    });

    await this.productsRepository.updateQuantity(products);
    return this.ordersRepository.create({
      customer,
      products: finalProducts
    });

  }
}

export default CreateOrderService;
