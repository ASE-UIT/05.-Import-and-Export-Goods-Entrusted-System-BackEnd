import { Customer } from '@/customers/models/customer.model';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum QuotationReqStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
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

  @HasMany(() => QuoteReqDetail)
  quoteReqDetails: QuoteReqDetail[]
}
