import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import sequelize from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasMany,
  DataType,
  Default,
  AllowNull,
} from 'sequelize-typescript';

@Table({ tableName: 'quotations' })
export class Quotation extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  totalPrice: number;

  @AllowNull(false)
  @Column
  pickupDate: Date;

  @AllowNull(false)
  @Column
  deliveryDate: Date;

  @AllowNull(false)
  @Column
  quotationDate: Date;

  @AllowNull(false)
  @Column
  expiredDate: Date;

  @AllowNull(false)
  @Column
  status: QuotationStatus;

  @HasMany(() => QuotationService)
  quotationServices: QuotationService[];
}
