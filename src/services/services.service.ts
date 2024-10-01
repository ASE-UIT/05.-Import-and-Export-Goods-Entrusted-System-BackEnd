import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './models/service.model';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service)
    private serviceModel: typeof Service,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceModel.findAll();
  }

  findOne(id: string): Promise<Service> {
    return this.serviceModel.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await user.destroy();
  }
}
