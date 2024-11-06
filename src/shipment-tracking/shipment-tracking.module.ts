import { Module } from '@nestjs/common';
import { ShipmentTrackingService } from './shipment-tracking.service';
import { ShipmentTrackingController } from './shipment-tracking.controller';
import { Shipment } from '@/shipment/models/shipment.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShipmentTracking } from './models/shipment-tracking.model';

@Module({
  imports: [SequelizeModule.forFeature([Shipment, ShipmentTracking])],
  providers: [ShipmentTrackingService],
  controllers: [ShipmentTrackingController],
  exports: [ShipmentTrackingService],
})
export class ShipmentTrackingModule {}
