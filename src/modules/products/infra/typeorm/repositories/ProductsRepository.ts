import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({ name, price, quantity });
    const savedProduct = await this.ormRepository.save(product);
    return savedProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({ name });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    return this.ormRepository.find({
      where: { id: In(products.map(product => product.id)) }
    });
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    return await Promise.all(products.map(async product => {
      const { id, quantity } = product;
      const saved = await this.ormRepository.findOne({ id });
      const newQuantity = saved ? saved.quantity - quantity : quantity;
      console.log(saved?.quantity, newQuantity);
      const updatedProduct = await this.ormRepository.save({ ...saved, quantity: newQuantity })
      return updatedProduct;
    }));
  }
}

export default ProductsRepository;
