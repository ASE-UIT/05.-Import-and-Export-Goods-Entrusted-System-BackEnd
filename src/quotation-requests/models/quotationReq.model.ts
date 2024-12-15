import { Quotation } from '@/quotations/models/quotations.model';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { User } from '@/users/models/user.model';
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
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
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
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column
  userId: string;

  @BelongsTo(() => User, { as: 'customer' })
  customer: User;
  @HasOne(() => QuoteReqDetail)
  quoteReqDetails: QuoteReqDetail;

  @HasOne(() => Quotation)
  quotation: Quotation;
}
