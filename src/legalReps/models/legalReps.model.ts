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
  @Column
  name: string;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
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
