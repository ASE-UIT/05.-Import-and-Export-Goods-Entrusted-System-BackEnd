import { User } from '@/users/models/user.model';
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
})
export class Employee extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: 'This email is already is already taken',
  })
  @Column
  email: string;

  @AllowNull(false)
  @Column
  phone: string;

  @AllowNull(false)
  @Column
  address: string;

  @AllowNull(false)
  @Column
  position: Position;

  @AllowNull(false)
  @Column
  dob: Date;

  @AllowNull(false)
  @Column
  coefficientSalary: number;

  @AllowNull(false)
  @Column
  baseSalary: number;

  @HasOne(() => User)
  user: User;
}
