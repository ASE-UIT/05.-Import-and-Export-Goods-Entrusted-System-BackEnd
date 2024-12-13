import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import { AllowNull, BelongsTo, BelongsToMany, Column, Default, ForeignKey, Model, PrimaryKey, Table, Unique } from 'sequelize-typescript';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';

@Table({
  tableName: 'contact-representatives-firm-representatives',
  timestamps: false,
})
export class ContactRepFirmRep extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ForeignKey(() => ContactRep)
  @AllowNull(false)
  @Column
  contactRepId: string;

  @ForeignKey(() => FirmRep)
  @AllowNull(false)
  @Column
  firmRepId: string;

  @BelongsTo(() => ContactRep)
  contactRep: ContactRep;

  @BelongsTo(() => FirmRep)
  firmRep: FirmRep;
}
