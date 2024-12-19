import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Shipment } from '@/shipment/models/shipment.model';
import { Document } from './models/document.model';
import { User } from '@/users/models/user.model';
import { Role } from '@/roles/models/role.model';
import { ShipmentModule } from '@/shipment/shipment.module';
import { ShipmentService } from '@/shipment/shipment.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Shipment, Document, User, Role]),
    ShipmentModule,
  ],
  providers: [DocumentService],
  controllers: [DocumentController],
})
export class DocumentModule {}
