import { Employee } from '@/employees/models/employee.model';
import { Invoice } from '@/invoices/models/invoice.model';
import { Quotation } from '@/quotations/models/quotations.model';
import { ContractStatus } from '@/shared/enums/contract-status.enum';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'contracts' })
export class Contract extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  startDate: Date;

  @AllowNull(false)
  @Column
  endDate: Date;

  @AllowNull(false)
  @Column
  status: ContractStatus;

  @AllowNull(false)
  @Column
  contractDate: Date;

  @ForeignKey(() => Employee)
  @AllowNull(false)
  @Column
  employeeId: string;

  @BelongsTo(() => Employee)
  employee: Employee;

  @ForeignKey(() => Quotation)
  @AllowNull(false)
  @Column
  quotationId: string;

  @BelongsTo(() => Quotation)
  quotation: Quotation;

  @HasMany(() => Invoice)
  invoice: Invoice[];
}
