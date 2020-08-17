import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService, { IRequest } from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(FindOrderService);
    const { id } = request.params;
    const savedOrder = await service.execute({ id });
    return response.send(savedOrder);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const service = container.resolve(CreateOrderService);
    const requestOrder: IRequest = request.body;
    const savedOrder = await service.execute(requestOrder);
    return response.send(savedOrder);
  }
}
