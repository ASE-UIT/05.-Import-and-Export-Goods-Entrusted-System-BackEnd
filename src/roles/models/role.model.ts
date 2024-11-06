import { RoleEnum } from '@/shared/enums/roles.enum';
import { User } from '@/users/models/user.model';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsToMany,
  Column,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'roles',
  timestamps: false,
})
export class Role extends Model {
  @ApiProperty()
  @Column({
    type: sequelize.DataTypes.UUID,
    primaryKey: true,
    defaultValue: sequelize.DataTypes.UUIDV4,
  })
  id: string;

  @ApiProperty({ enum: RoleEnum })
  @Unique
  @AllowNull(false)
  @Column
  name: RoleEnum;

  //Associations
  @HasMany(() => User)
  users: User[];
}
