import { Provider } from '@/providers/models/provider.model';
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
  tableName: 'contact_reps',
})
export class ContactRep extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: "This name is already exist",
  })
  @Column
  name: string;

  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: "This email address is already taken",
  })
  @Column
  email: string;

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
