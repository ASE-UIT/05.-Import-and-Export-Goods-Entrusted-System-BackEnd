import { UpdateQuotationDto } from '@/quotations/dtos/UpdateQuotationDto';
import { Quotation } from '@/quotations/models/quotations.model';

export interface IUpdateQuotationStrategy {
  update(
    quotationId: string,
    udpateInfo: Partial<UpdateQuotationDto>,
  ): Promise<Quotation>;
}
