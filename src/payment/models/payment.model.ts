import { Invoice } from '@/invoices/models/invoice.model';
import { PaymentStatus } from '@/shared/enums/payment-status.enum';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  amountPaid: number;

  @ApiProperty()
  @AllowNull(false)
  @Column
  status: PaymentStatus;

  @ApiProperty()
  @Default(new Date())
  @Column
  createdAt: Date;

  @ApiProperty()
  @ForeignKey(() => Invoice)
  @AllowNull(false)
  @Column
  invoiceId: string;

  @BelongsTo(() => Invoice)
  invoice: Invoice;
}
