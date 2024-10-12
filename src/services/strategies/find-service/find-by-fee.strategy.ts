import { Service } from '@/services/models/service.model';
import { Injectable } from '@nestjs/common';
import { IFindServiceStrategy } from './find-service-strategy.interface';

@Injectable()
export class FindServiceByFeeStrategy implements IFindServiceStrategy {
  async find(serviceFee: number): Promise<Service[] | null> {
    return Service.findAll({ where: { fee: serviceFee } });
  }
}
