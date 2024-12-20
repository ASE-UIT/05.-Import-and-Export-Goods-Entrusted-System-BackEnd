import { ContactRepFirmRep } from '@/contact-representatives-firm-representatives/models/contact-firm-representatives.model';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';
import { Provider } from '@/providers/models/providers.model';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'contact-representatives',
  timestamps: false,
})
export class ContactRep extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: "This name is already exist",
  })
  @Column
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: "This email address is already taken",
  })
  @Column
  email: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'phone_conflict',
    msg: "This phone number is already taken",
  })
  @Column
  phone: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  branch_location: string;

  @ApiProperty()
  @ForeignKey(() => Provider)
  @AllowNull(false)
  @Column
  provider_id: string;

  @BelongsTo(() => Provider)
  provider: Provider;

  @BelongsToMany(() => FirmRep, () => ContactRepFirmRep)
  firmReps: FirmRep[];
}
