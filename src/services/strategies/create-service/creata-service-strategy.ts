import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateServiceStrategy } from './create-service-stategy.interface';
import { CreateServiceDto } from '@/services/dtos/CreateServiceDto';
import { Service } from '@/services/models/service.model';
import { SequelizeScopeError, UniqueConstraintError } from 'sequelize';
import { ErrorReply } from 'redis';

@Injectable()
export class CreateServiceStrategy implements ICreateServiceStrategy {
  async create(serviceInfo: CreateServiceDto): Promise<Service> {
    const service = new Service();
    service.name = serviceInfo.name;
    service.shortName = serviceInfo.shortName;
    service.fee = serviceInfo.fee;
    try {
      await service.save();
      return service;
    } catch (err) {
      if (err instanceof UniqueConstraintError)
        throw new ConflictException(err.errors[0].message);
    }
  }
}
