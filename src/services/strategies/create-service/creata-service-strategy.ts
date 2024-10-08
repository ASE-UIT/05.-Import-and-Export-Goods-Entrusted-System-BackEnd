import { Injectable } from '@nestjs/common';
import { ICreateServiceStrategy } from './create-service-stategy.interface';
import { CreateServiceDto } from '@/services/dtos/CreateServiceDto';
import { Service } from '@/services/models/service.model';

@Injectable()
export class CreateServiceStrategy implements ICreateServiceStrategy {
  async create(serviceInfo: CreateServiceDto): Promise<void> {
    // Create a new service
    const service = new Service();
    service.name = serviceInfo.name;
    service.shortName = serviceInfo.shortName;
    service.fee = serviceInfo.fee;
    await service.save();
  }
}
