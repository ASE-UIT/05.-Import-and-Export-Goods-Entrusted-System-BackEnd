import { Provider } from '@/providers/models/providers.model';
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

  @HasMany(() => Provider)
  providers: Provider[];
}
