import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';

@Table({ tableName: 'Service', timestamps: false })
export class Service extends Model<Service> {
  @PrimaryKey
  @AutoIncrement
  @Column
  service_id: number;

  @Column
  name: string;

  @Column
  short_name: string;

  @Column
  fee: number;

  @HasMany(() => QuotationService)
  quotationServices: QuotationService[];
}
