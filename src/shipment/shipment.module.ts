import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ShipmentTracking } from '@/shipment-tracking/models/shipment-tracking.model';
import { Document } from '@/document/models/document.model';
import { ShipmentTrackingModule } from '@/shipment-tracking/shipment-tracking.module';
import { Shipment } from './models/shipment.model';
import { User } from '@/users/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ShipmentTracking, Document, Shipment]),
    ShipmentTrackingModule,
  ],
  providers: [ShipmentService],
  controllers: [ShipmentController],
  exports: [ShipmentService],
})
export class ShipmentModule {}
