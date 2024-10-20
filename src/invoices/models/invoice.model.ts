import { Contract } from '@/contracts/models/contract.model';
import { Employee } from '@/employees/models/employee.model';
import { Payment } from '@/payment/models/payment.model';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'invoices' })
export class Invoice extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  invoiceDate: Date;

  @AllowNull(false)
  @Column
  paidDate: Date;

  @AllowNull(false)
  @Column
  status: InvoiceStatus;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  taxAmount: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  totalAmount: number;


  @HasMany(() => Payment)
  payments: Payment[];

  @ForeignKey(() => Employee)
  @AllowNull(false)
  @Column
  employeeId: string;

  @BelongsTo(() => Employee)
  employee: Employee;

  @ForeignKey(() => Contract)
  @AllowNull(false)
  @Column
  contractId: string;

  @BelongsTo(() => Contract)
  contract: Contract;
}
