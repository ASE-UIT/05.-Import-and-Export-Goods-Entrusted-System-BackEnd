import { LegalRep } from '@/legalReps/models/legalReps.model';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';
import sequelize from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
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
  @Column
  name: string;

  @AllowNull(false)
  @Column
  shortName: string;

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
  taxId: string;

  //Associations
  @HasMany(() => LegalRep)
  legalReps: LegalRep[];

  @HasMany(() => QuotationReq)
  quotationReqs: QuotationReq[];
}
