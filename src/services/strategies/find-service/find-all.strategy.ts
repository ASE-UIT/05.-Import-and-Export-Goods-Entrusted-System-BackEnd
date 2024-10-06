import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@/services/models/service.model';

@Injectable()
export class FindAllServiceStrategy {
  async find(serviceInfo: string): Promise<Service[] | null> {
    return serviceInfo === 'true' && Service.findAll();
  }
}
