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
  tableName: 'contactReps',
})
export class ContactRep extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: "Contact representative's name already exist",
  })
  @Column
  name: string;

  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: "Contact representative's email already exist",
  })
  @Column
  email: string;

  @AllowNull(false)
  @Unique({
    name: 'phone_conflict',
    msg: "Contact representative's phone already exist",
  })
  @Column
  phone: string;

  @ForeignKey(() => Provider)
  @AllowNull(false)
  @Column
  providerId: string;

  @BelongsTo(() => Provider)
  provider: Provider;
}
