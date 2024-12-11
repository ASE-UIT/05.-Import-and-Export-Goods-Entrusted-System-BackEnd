import { Contract } from '@/contracts/models/contract.model';
import { Quotation } from '@/quotations/models/quotations.model';
import { User } from '@/users/models/user.model';
import { All } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsToMany,
  Column,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

export enum Position {
  MANAGER = 'MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  SALES = 'SALES',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  HUMAN_RESOURCES = 'HUMAN_RESOURCES',
  DOCUMENTATION = 'DOCUMENTATION',
}

@Table({
  tableName: 'employees',
  timestamps: false,
})
export class Employee extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: 'This email is already is already taken',
  })
  @Column
  email: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  phone: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  address: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  position: Position;

  @ApiProperty()
  @AllowNull(false)
  @Column
  dob: Date;

  @ApiProperty()
  @AllowNull(false)
  @Column
  coefficientSalary: number;

  @ApiProperty()
  @AllowNull(false)
  @Column
  baseSalary: number;

  @HasOne(() => User)
  //@AllowNull(true)
  user?: User;

  //one employee can make many contracts
  @HasMany(() => Contract)
  contracts: Contract[];

  @HasMany(() => Quotation)
  quotations: Quotation[];
}
