import { Injectable } from '@nestjs/common';
import { ICreateQuotationReqStrategy } from './create-quotationReq.interface';
import { CreateQuotationReqDto } from '../../dtos/CreateQuotationReqDto';
import { QuotationReq } from '../../models/quotationReq.model';

@Injectable()
export class CreateQuotationReqStrategy implements ICreateQuotationReqStrategy {
    async create(quotationReqInfo: CreateQuotationReqDto): Promise<void> {
        // Create a new quotation request
        // const customer = new Customer();
        // customer.name = customerInfo.name;
        // customer.shortName = customerInfo.shortName;
        // customer.email = customerInfo.email;
        // customer.phone = customerInfo.phone;
        // customer.address = customerInfo.address;
        // customer.taxId = customerInfo.taxId;

        const quotationReq = new QuotationReq()
        quotationReq.requestDate = quotationReqInfo.requestDate
        quotationReq.status = quotationReqInfo.status
        quotationReq.customerId = quotationReqInfo.customerId
        await quotationReq.save();
    }
}
