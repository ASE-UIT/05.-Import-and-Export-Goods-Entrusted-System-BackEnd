import { CreateServiceDto } from '@/services/dtos/CreateServiceDto';

export interface ICreateServiceStrategy {
  create(serviceInfo: CreateServiceDto): Promise<void>;
}
