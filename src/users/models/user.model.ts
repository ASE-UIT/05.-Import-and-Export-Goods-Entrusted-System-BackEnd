import { Employee } from '@/employees/models/employee.model';
import { Role } from '@/roles/models/role.model';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
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
  @AllowNull(false)
  @Column
  employeeId: string;

  @ApiProperty()
  @BelongsTo(() => Employee)
  employee: Employee;
}
