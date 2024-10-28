import { User } from '@/users/models/user.model';
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
})
export class Role extends Model {
  @Column({
    type: sequelize.DataTypes.UUID,
    primaryKey: true,
    defaultValue: sequelize.DataTypes.UUIDV4,
  })
  id: string;

  @Unique
  @AllowNull(false)
  @Column
  name: string;

  //Associations
  @HasMany(() => User)
  users: User[];
}
