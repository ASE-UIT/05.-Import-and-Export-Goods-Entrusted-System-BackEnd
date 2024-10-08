import { QuotationService } from '@/quotation-services/models/quotation-services.model';
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
} from 'sequelize-typescript';

@Table({ tableName: 'quotations', timestamps: true })
export class Quotation extends Model<Quotation> {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  quotationId: string;

  // Thuộc tính id của bảng quotationsReps
  @Default(sequelize.UUIDV4)
  @Column
  quoteRequestId: string;

  // Thuộc tính id của bảng employee
  @Default(sequelize.UUIDV4)
  @Column
  employeeId: string;

  // Thuộc tính id của bảng freight
  @Default(sequelize.UUIDV4)
  @Column
  freightId: string;

  @Column
  totalPrice: number;

  @Column
  pickupDate: string;

  @Column
  deliveryDate: string;

  @Column
  quotationDate: string;

  @Column
  expiredDate: string;

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
