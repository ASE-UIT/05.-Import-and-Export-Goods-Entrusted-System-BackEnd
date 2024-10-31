import { Invoice } from '@/invoices/models/invoice.model';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'payments',
})
export class Payment extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  amountPaid: number;

  @AllowNull(false)
  @Column
  status: PaymentStatus;

  @ForeignKey(() => Invoice)
  @AllowNull(false)
  @Column
  invoiceId: string;

  @BelongsTo(() => Invoice)
  invoice: Invoice;
}
