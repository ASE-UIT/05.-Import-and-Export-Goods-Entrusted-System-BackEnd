import { Injectable } from '@nestjs/common';
import { IFindServiceStrategy } from './find-service-strategy.interface';
import { Service } from '@/services/models/service.model';

@Injectable()
export class FindServiceByNameStrategy implements IFindServiceStrategy {
  async find(serviceName: string): Promise<Service[] | null> {
    return Service.findAll({ where: { name: serviceName } });
  }
}
