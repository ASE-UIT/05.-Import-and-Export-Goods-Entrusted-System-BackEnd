import { Employee } from '@/employees/models/employee.model';
import { Role } from '@/roles/models/role.model';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @Unique
  @AllowNull(false)
  @Column
  username: string;

  @Unique
  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  hashedPassword: string;

  //Associations
  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column
  roleId: string;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Employee)
  @AllowNull(false)
  @Column
  employeeId: string;

  @BelongsTo(() => Employee)
  employee: Employee;
}
