import { Contract } from '@/contracts/models/contract.model';
import { Customer } from '@/customers/models/customer.model';
import { Employee } from '@/employees/models/employee.model';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { Quotation } from '@/quotations/models/quotations.model';
import { Role } from '@/roles/models/role.model';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: false,
})
export class User extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @Unique({
    name: 'username_conflict',
    msg: 'This username is already is already taken',
  })
  @AllowNull(false)
  @Column
  username: string;

  @AllowNull(false)
  @Column
  hashedPassword: string;

  //Associations
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column({
    type: sequelize.DataTypes.UUID,
  })
  roleId: string;

  @ApiProperty()
  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Employee)
  @AllowNull(true)
  @Column
  employeeId?: string;

  @ApiProperty()
  @BelongsTo(() => Employee)
  //@AllowNull(true)
  employee?: Employee;

  @ForeignKey(() => Customer)
  @AllowNull(true)
  @Column
  customerId?: string;

  @ApiProperty()
  @BelongsTo(() => Customer)
  //@AllowNull(true)
  customer?: Customer;

  @HasMany(() => QuotationReq)
  quotationReqs: QuotationReq[];

  // Mối quan hệ với Quotation
  @HasMany(() => Quotation)
  quotations: Quotation[];

  // Mối quan hệ với Contract
  @HasMany(() => Contract)
  contracts: Contract[];
}
