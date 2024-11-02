import { Document } from '@/document/models/document.model';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';
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
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @AllowNull(false)
  @Column
  shipmentType: ShipmentType;

  @AllowNull(false)
  @Column
  contractId: string;

  //Associations
  @HasOne(() => ShipmentTracking)
  tracking: ShipmentTracking;

  @HasMany(() => Document)
  document: Document[];
}
