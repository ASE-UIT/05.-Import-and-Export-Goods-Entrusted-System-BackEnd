import sequelize from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum ProviderStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  tableName: 'providers',
})
export class Provider extends Model {
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
  country: string;

  @Default(ProviderStatus.ACTIVE)
  @Column
  status: ProviderStatus;
}
