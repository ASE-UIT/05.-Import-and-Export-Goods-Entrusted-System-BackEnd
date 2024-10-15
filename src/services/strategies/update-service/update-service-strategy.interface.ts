import { CreateServiceDto } from '@/services/dtos/CreateServiceDto';
import { Service } from '@/services/models/service.model';
export interface IUpdateServiceStrategy {
  update(
    serviceId: string,
    udpateInfo: Partial<CreateServiceDto>,
  ): Promise<Service>;
}
