import { Service } from '@/services/models/service.model';

export interface IFindServiceStrategy {
  find(serviceInfo: string): Promise<Service[] | null>;
}
