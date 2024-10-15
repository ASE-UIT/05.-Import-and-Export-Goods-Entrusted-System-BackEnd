import { Injectable } from '@nestjs/common';
import { IFindServiceStrategy } from './find-service-strategy.interface';
import { Service } from '@/services/models/service.model';

@Injectable()
export class FindServiceByShortNameStrategy implements IFindServiceStrategy {
  async find(serviceShortName: string): Promise<Service[] | null> {
    return Service.findAll({ where: { shortName: serviceShortName } });
  }
}
