import { Quotation } from '@/quotations/models/quotations.model';
import { Service } from '@/services/models/service.model';
import { Column, Model, Table, PrimaryKey, ForeignKey } from 'sequelize-typescript';


@Table({ tableName: 'QuotationService', timestamps: false })
export class QuotationService extends Model<QuotationService> {
  @PrimaryKey
  @ForeignKey(() => Quotation)
  @Column
  quotation_id: number;

  @PrimaryKey
  @ForeignKey(() => Service)
  @Column
  service_id: number;
}