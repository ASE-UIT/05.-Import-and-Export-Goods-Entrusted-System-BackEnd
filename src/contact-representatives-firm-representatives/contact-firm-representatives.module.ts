import { Module } from '@nestjs/common';
import { ContactRepFirmRepService } from './contact-firm-representatives.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactRepFirmRep } from './models/contact-firm-representatives.model';
import { ContactRepFirmRepController } from './contact-firm-representatives.controller';
import { CreateContactRepFirmRepStrategy } from './strategies/create-contact-firm-representatives/create-contact-firm-representatives.strategy';
import { UpdateContactRepFirmRepStrategy } from './strategies/update-contact-firm-representatives/update-contact-firm-representatives.strategy';
import { ContactRep } from '@/contact-representatives/models/contact-representatives.model';
import { FirmRep } from '@/firm-representatives/models/firm-representatives.model';
import { FindContactRepFirmRepStrategy } from './strategies/find-contact-firm-representatives/find-contact-representatives-firm-representatives-strategy.enum';

@Module({
  imports: [SequelizeModule.forFeature([ContactRepFirmRep, ContactRep, FirmRep])],
  controllers: [ContactRepFirmRepController],
  providers: [
    ContactRepFirmRepService,
    CreateContactRepFirmRepStrategy,
    UpdateContactRepFirmRepStrategy,
    //FindContactRepFirmRepStrategy,
    ],
})
export class ContactRepFirmRepModule {}
