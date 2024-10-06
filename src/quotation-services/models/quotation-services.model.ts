import { Quotation } from '@/quotations/models/quotations.model';
import { Service } from '@/services/models/service.model';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'quotation_services', timestamps: true })
export class QuotationService extends Model<QuotationService> {
  // Thuộc tính id của bảng quotation
  @PrimaryKey
  @ForeignKey(() => Quotation)
  @Column
  quotation_id: string;

  // Thuộc tính id của bảng service
  @PrimaryKey
  @ForeignKey(() => Service)
  @Column
  service_id: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW, // Đảm bảo giá trị mặc định cho createdAt
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW, // Đảm bảo giá trị mặc định cho updatedAt
  })
  updatedAt: Date;
}
