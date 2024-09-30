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
  position: string;

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
