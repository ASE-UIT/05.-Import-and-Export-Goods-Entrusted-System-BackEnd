import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Service } from './models/service.model';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service)
    private serviceModel: typeof Service,
  ) {}

  findAll(): Promise<Service[]> {
    return this.serviceModel.findAll();
  }

  findOne(id: string): Promise<Service> {
    return this.serviceModel.findOne({
      where: {
        id,
      },
    });
  }

  async create(service: Service): Promise<Service> {
    return this.serviceModel.create(service);
  }

  async update(id: number, service: Service): Promise<[number, Service[]]> {
    return this.serviceModel.update(service, {
      where: { service_id: id },
      returning: true, // Trả về bản ghi sau khi cập nhật
    });
  }

  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await service.destroy();
  }
}
