import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import sequelize from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  HasMany,
  Default,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'services', timestamps: true })
export class Service extends Model<Service> {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  serviceId: string;

  @Column
  name: string;

  @Column
  shortName: string;

  @Column
  fee: number;

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

  @HasMany(() => QuotationService)
  quotationServices: QuotationService[];
}
