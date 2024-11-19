import { Contract } from '@/contracts/models/contract.model';
import { Employee } from '@/employees/models/employee.model';
import { Payment } from '@/payment/models/payment.model';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Col } from 'sequelize/types/utils';

@Table({ tableName: 'invoices' })
export class Invoice extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Default(new Date())
  @Column
  invoiceDate: Date;

  @ApiProperty()
  @AllowNull(true)
  @Column
  paidDate: Date;

  @ApiProperty()
  @AllowNull(false)
  @Default(InvoiceStatus.PENDING)
  @Column
  status: InvoiceStatus;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  taxAmount: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  totalAmount: number;

  @ApiProperty()
  @AllowNull(false)
  @Column
  expiredDate: Date;

  @HasMany(() => Payment)
  payments: Payment[];

  @ApiProperty()
  @ForeignKey(() => Employee)
  @AllowNull(false)
  @Column
  employeeId: string;

  @BelongsTo(() => Employee)
  employee: Employee;

  @ApiProperty()
  @ForeignKey(() => Contract)
  @AllowNull(false)
  @Column
  contractId: string;

  @BelongsTo(() => Contract)
  contract: Contract;

  @ApiProperty()
  @AllowNull(false)
  @Default(0)
  @Column
  paidAmount: number;
}
