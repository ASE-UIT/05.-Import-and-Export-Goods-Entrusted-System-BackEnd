import { Customer } from '@/customers/models/customer.model';
import { Quotation } from '@/quotations/models/quotations.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum QuotationReqStatus {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED'
}

@Table({
  tableName: 'quotation_reqs',
})
export class QuotationReq extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  requestDate: Date;

  @AllowNull(false)
  @Column
  status: QuotationReqStatus;

  // Associations
  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column
  customerId: string;

  @BelongsTo(() => Customer)
  customer: Customer;

  @HasOne(() => QuoteReqDetail)
  quoteReqDetails: QuoteReqDetail

  @HasOne(() => Quotation)
  quotation: Quotation
}
