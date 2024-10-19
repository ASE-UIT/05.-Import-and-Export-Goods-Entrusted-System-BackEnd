import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '@/services/models/service.model';

@Injectable()
export class FindAllServiceStrategy implements FindAllServiceStrategy {
  async find(): Promise<Service[] | null> {
    return Service.findAll();
  }
}
