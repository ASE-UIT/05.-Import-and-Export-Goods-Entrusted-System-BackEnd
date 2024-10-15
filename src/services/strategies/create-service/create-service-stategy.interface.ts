import { CreateServiceDto } from '@/services/dtos/CreateServiceDto';
import { Service } from '@/services/models/service.model';

export interface ICreateServiceStrategy {
  create(serviceInfo: CreateServiceDto): Promise<Service>;
}
