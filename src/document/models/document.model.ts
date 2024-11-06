import { Shipment } from '@/shipment/models/shipment.model';
import { ApiProperty } from '@nestjs/swagger';
import { UUIDV4 } from 'sequelize';
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

@Table({ tableName: 'document' })
export class Document extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  type: string;

  @ApiProperty()
  @AllowNull
  @Column
  image: string;

  @ApiProperty()
  @AllowNull(false)
  @Unique({
    name: 'docNumber_conflict',
    msg: 'This document number is taken',
  })
  @Column
  docNumber: number;

  //Association
  @ApiProperty()
  @ForeignKey(() => Shipment)
  @AllowNull(false)
  @Column
  shipmentId: string;

  @BelongsTo(() => Shipment)
  shipment: Shipment;
}
