import { Service } from '@/services/models/service.model';

export interface IFindServiceStrategy {
  find(serviceInfo: any): Promise<Service[] | null>;
}
