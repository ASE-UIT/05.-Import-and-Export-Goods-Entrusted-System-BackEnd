import { Document } from '@/document/models/document.model';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';
import { ApiProperty } from '@nestjs/swagger';
import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  Column,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum ShipmentType {
  AIR = 'AIR',
  SEA = 'SEA',
  LAND = 'LAND',
}

@Table({ tableName: 'shipment', timestamps: false })
export class Shipment extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column
  shipmentType: ShipmentType;

  @ApiProperty()
  @AllowNull(false)
  @Column
  contractId: string;

  //Associations
  @HasOne(() => ShipmentTracking)
  tracking: ShipmentTracking;

  @HasMany(() => Document)
  document: Document[];
}
