import { LegalRep } from '@/legalReps/models/legalReps.model';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import sequelize from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'customers',
})
export class Customer extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: "Customer's name already exist",
  })
  @Column
  name: string;

  @AllowNull(false)
  @Column
  shortName: string;

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
    msg: 'Phone number is already taken',
  })
  @Column
  phone: string;

  @AllowNull(false)
  @Column
  address: string;

  @AllowNull(false)
  @Unique({
    name: 'taxId_conflict',
    msg: 'Tax ID already exist',
  })
  @Column
  taxId: string;

  //Associations
  @HasMany(() => LegalRep)
  legalReps: LegalRep[];

  @HasMany(() => QuotationReq)
  quotationReqs: QuotationReq[];
}
