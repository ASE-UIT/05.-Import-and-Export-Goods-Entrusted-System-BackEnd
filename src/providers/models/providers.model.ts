import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
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
  timestamps: false,
})
export class Provider extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: "Provider's name already exist",
  })
  @Column
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: 'Email is already taken',
  })
  @Column
  email: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'phone_conflict',
    msg: 'Phone number is already taken'
  })
  @Column
  phone: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  address: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  country: string;

  @ApiProperty()
  @AllowNull(false)
  @Default(ProviderStatus.INACTIVE)
  @Column
  status: ProviderStatus;

  @ApiProperty()
  @ForeignKey(() => ContactRep)
  @AllowNull(false)
  @Column
  contactRepId: string;

  @HasMany(() => ContactRep)
  contactRep: ContactRep;
}
