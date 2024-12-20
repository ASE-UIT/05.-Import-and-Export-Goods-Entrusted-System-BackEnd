import { Employee } from '@/employees/models/employee.model';
import { Invoice } from '@/invoices/models/invoice.model';
import { Quotation } from '@/quotations/models/quotations.model';
import { ContractStatus } from '@/shared/enums/contract-status.enum';
import { Shipment } from '@/shipment/models/shipment.model';
import { User } from '@/users/models/user.model';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  startDate: Date;

  @ApiProperty()
  @AllowNull(false)
  @Column
  endDate: Date;

  @ApiProperty()
  @AllowNull(false)
  @Column
  status: ContractStatus;

  @ApiProperty()
  @AllowNull(false)
  @Column
  contractDate: Date;

  @ApiProperty()
  @ForeignKey(() => Employee)
  @AllowNull(false)
  @Column
  employeeId: string;

  @BelongsTo(() => Employee)
  employee: Employee;

  @ApiProperty()
  @ForeignKey(() => Quotation)
  @AllowNull(false)
  @Column
  quotationId: string;

  @BelongsTo(() => Quotation)
  quotation: Quotation;

  @HasMany(() => Invoice)
  invoice: Invoice[];

  @HasOne(() => Shipment)
  shipment: Shipment;

  @ApiProperty()
  @ForeignKey(() => User) 
  @AllowNull(false)
  @Column
  userId: string; 

  @BelongsTo(() => User)
  user: User;
}
