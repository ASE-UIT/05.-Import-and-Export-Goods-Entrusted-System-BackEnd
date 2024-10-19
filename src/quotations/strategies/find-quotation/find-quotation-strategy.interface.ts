import { Quotation } from '@/quotations/models/quotations.model';

export interface IFindQuotationStrategy {
  find(quotationInfo: any): Promise<Quotation[] | null>;
}
