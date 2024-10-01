import sequelize from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
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
}
