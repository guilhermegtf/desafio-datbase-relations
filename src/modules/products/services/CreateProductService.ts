import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductsRepository') private productsRepository: IProductsRepository
  ) { }

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const sameNameProduct = await this.productsRepository.findByName(name);

    if (sameNameProduct) {
      throw new AppError('This product already registered');
    }
    
    const saved = await this.productsRepository.create({ name, price, quantity });
    return saved;
  }
}

export default CreateProductService;
