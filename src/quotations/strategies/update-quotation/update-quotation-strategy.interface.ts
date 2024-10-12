import { CreateQuotationDto } from '@/quotations/dtos/CreateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';

export interface IUpdateQuotationStrategy {
  update(
    quotationId: string,
    udpateInfo: Partial<CreateQuotationDto>,
  ): Promise<Quotation>;
}
