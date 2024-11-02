import { Shipment } from '@/shipment/models/shipment.model';
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
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  type: string;

  @AllowNull
  @Column
  image: string;

  @AllowNull(false)
  @Unique({
    name: 'docNumber_conflict',
    msg: 'This document number is taken',
  })
  @Column
  docNumber: number;

  //Association
  @ForeignKey(() => Shipment)
  @AllowNull(false)
  @Column
  shipmentId: string;

  @BelongsTo(() => Shipment)
  shipment: Shipment;
}
