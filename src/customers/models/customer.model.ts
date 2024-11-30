import { LegalRep } from '@/legal-representative/models/legal-rep.model';
//import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';
import { QuotationReq } from '@/quotation-requests/models/quotationReq.model';
import { ApiProperty } from '@nestjs/swagger';
import sequelize, { HasOne } from 'sequelize';
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
  tableName: 'customers',
  timestamps: false,
})
export class Customer extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'name_conflict',
    msg: "Customer's name already exist",
  })
  @Column
  name: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  shortName: string;

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
    msg: 'Phone number is already taken',
  })
  @Column
  phone: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  address: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'taxId_conflict',
    msg: 'Tax ID already exist',
  })
  @Column
  taxId: string;

  //Associations
  // @HasOne(() => LegalRep, 'id')
  // legalReps: LegalRep;

  @HasMany(() => QuotationReq)
  quotationReqs: QuotationReq[];

  @ForeignKey(() => LegalRep)
  @AllowNull(true)
  @Column
  legalRepId: string;

  @ApiProperty()
  @BelongsTo(() => LegalRep)
  legalRep: LegalRep;
}
