import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';

@Table({ tableName: 'Quotation', timestamps: false })
export class Quotation extends Model<Quotation> {
  @PrimaryKey
  @AutoIncrement
  @Column
  quotation_id: number;

  @Column
  quote_request_id: number;

  @Column
  employee_id: number;

  @Column
  total_price: number;

  @Column
  pickup_date: Date;

  @Column
  delivery_date: Date;

  @Column
  quotation_date: Date;

  @Column
  expired_date: Date;

  @Column
  freight_id: number;

  @HasMany(() => QuotationService)
  quotationServices: QuotationService[];
}
