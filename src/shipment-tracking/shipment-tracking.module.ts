import { Module } from '@nestjs/common';
import { ShipmentTrackingService } from './shipment-tracking.service';
import { ShipmentTrackingController } from './shipment-tracking.controller';
import { Shipment } from '@/shipment/models/shipment.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FindAllShipmentTrackingStrategy } from './find-strategies/find-all.strategy';
import { FindShipmentTrackingByLocationStrategy } from './find-strategies/find-by-location.strategy';
import { FindShipmentTrackingByStatusStrategy } from './find-strategies/find-by-status.strategy';
import { FindShipmentTrackingByShipmentIdStrategy } from './find-strategies/find-by-shipment-id.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Shipment])],
  providers: [
    ShipmentTrackingService,
    FindAllShipmentTrackingStrategy,
    FindShipmentTrackingByLocationStrategy,
    FindShipmentTrackingByStatusStrategy,
    FindShipmentTrackingByShipmentIdStrategy,
  ],
  controllers: [ShipmentTrackingController],
  exports: [ShipmentTrackingService],
})
export class ShipmentTrackingModule {}
