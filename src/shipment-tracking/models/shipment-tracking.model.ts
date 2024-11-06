import { Shipment } from '@/shipment/models/shipment.model';
import { ApiProperty } from '@nestjs/swagger';
import { UUIDV4 } from 'sequelize';
import {
  AllowNull,
  BelongsTo,
  Column,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';

export enum ShipmentTrackingStatus {
  PENDING = 'PENDING',
  DOCUMENT_VERIFICATION = 'DOCUMENT_VERIFICATION',
  CUSTOMS_CLEARANCE_PENDING = 'CUSTOMS_CLEARANCE_PENDING',
  CUSTOMS_CLEARED = 'CUSTOMS_CLEARED',
  PROCESSING_AT_ORIGIN_PORT = 'PROCESSING_AT_ORIGIN_PORT',
  LOADED_ON_VESSEL = 'LOADED_ON_VESSEL',
  IN_TRANSIT = 'IN_TRANSIT',
  ARRIVE_AT_DESTINATION_PORT = 'ARRIVE_AT_DESTINATION_PORT',
  CUSTOMS_CLEARANCE_AT_DESTINATION = 'CUSTOMS_CLEARANCE_AT_DESTINATION',
  PROCESSING_AT_DESTINATION_WAREHOUSE = 'PROCESSING_AT_DESTINATION_WAREHOUSE',
  DELIVERED = 'DELIVERED',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  FAILED_DELIVERY_ATTEMPT = 'FAILED_DELIVERY_ATTEMPT',
  HELD_AT_CUSTOMS = 'HELD_AT_CUSTOMS',
  RETURNED_TO_SENDER = 'RETURNED_TO_SENDER',
  ON_HOLD = 'ON_HOLD',
}

@Table({ tableName: 'shipment_tracking', timestamps: false })
export class ShipmentTracking extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @Default(ShipmentTrackingStatus.PENDING)
  @Column
  status: ShipmentTrackingStatus;

  @ApiProperty()
  @AllowNull(false)
  @Column
  location: string;

  //Associations
  @ApiProperty()
  @ForeignKey(() => Shipment)
  @AllowNull(false)
  @Column
  shipmentId: string;

  @BelongsTo(() => Shipment)
  shipment: Shipment;
}
