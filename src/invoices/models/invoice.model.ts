import { Employee } from '@/employees/models/employee.model';
import { InvoiceStatus } from '@/shared/enums/invoice-status.enum';
import sequelize from 'sequelize';
import {
  AllowNull,
  Column,
  DataType,
  Default,
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

  /*
  //Associations
  @HasMany(() => Contract)
  contracts: Contract[];

  @HasMany(() => Employee)
  employees: Employee[];
  */
}
