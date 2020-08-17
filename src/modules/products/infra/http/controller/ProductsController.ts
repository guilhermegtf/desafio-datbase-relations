import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import Product from '../../typeorm/entities/Product';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(CreateProductService);
    const product: Product = request.body;
    const savedProduct = await service.execute(product);
    return response.send(savedProduct);
  }
}
