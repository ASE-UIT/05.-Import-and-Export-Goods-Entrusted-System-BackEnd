import { Contract } from '@/contracts/models/contract.model';
import { Document } from '@/document/models/document.model';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export enum ShipmentType {
  AIR = 'AIR',
  LAND = 'LAND',
  FCL = 'FCL',
  LCL = 'LCL',
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
  @ForeignKey(() => Contract)
  @AllowNull(false)
  @Column
  contractId: string;

  //Associations
  @HasOne(() => ShipmentTracking)
  tracking: ShipmentTracking;

  @HasMany(() => Document)
  document: Document[];

  @BelongsTo(() => Contract)
  contract: Contract;
}
