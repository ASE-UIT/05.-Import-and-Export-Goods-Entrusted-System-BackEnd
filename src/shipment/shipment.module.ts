import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';
import { Document } from '@/document/models/document.model';
import { ShipmentTrackingService } from '@/shipment-tracking/shipment-tracking.service';
import { ShipmentTrackingModule } from '@/shipment-tracking/shipment-tracking.module';
import { FindAllShipmentStrategy } from './find-strategies/find-all.strategy';
import { FindShipmentByContractIdStrategy } from './find-strategies/find-by-contract-id.strategy';
import { FindShipmentByShipmentTypeStrategy } from './find-strategies/find-by-shipment-type.strategy';
import { Shipment } from './models/shipment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ShipmentTracking, Document, Shipment]),
    ShipmentTrackingModule,
  ],
  providers: [
    ShipmentService,
    FindAllShipmentStrategy,
    FindShipmentByContractIdStrategy,
    FindShipmentByShipmentTypeStrategy,
  ],
  controllers: [ShipmentController],
})
export class ShipmentModule {}
