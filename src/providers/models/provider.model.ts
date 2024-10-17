import { ContactRep } from '@/contactReps/models/contactReps.model';
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
  @Unique({
    name: 'name_conflict',
    msg: "Provider's name already exist",
  })
  @Column
  name: string;

  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: 'Email is already taken',
  })
  @Column
  email: string;

  @AllowNull(false)
  @Unique({
    name: 'phone_conflict',
    msg: 'Phone number is already taken'
  })
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

  @ForeignKey(() => ContactRep)
  @AllowNull(false)
  @Column
  contactRepId: string;

  @BelongsTo(() => ContactRep)
  contactRep: ContactRep;
}
