import { Customer } from '@/customers/models/customer.model';
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

@Table({
  tableName: 'legal_reps',
})
export class LegalRep extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: 'This name is already exist',
  })
  @Column
  name: string;

  @AllowNull(false)
  @Unique({
    name: 'email_conflict',
    msg: 'This email address is already taken',
  })
  @Column
  email: string;

  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: 'This phone number is already taken',
  })
  @Column
  phone: string;

  //Associations
  @ForeignKey(() => Customer)
  @AllowNull(false)
  @Column
  customerId: string;

  @BelongsTo(() => Customer)
  customer: Customer;
}
