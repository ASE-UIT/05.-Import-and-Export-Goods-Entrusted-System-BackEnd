import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';

export interface ICreateQuotationStrategy {
  create(quotationInfo: CreateQuotationDto): Promise<Quotation>;
}
