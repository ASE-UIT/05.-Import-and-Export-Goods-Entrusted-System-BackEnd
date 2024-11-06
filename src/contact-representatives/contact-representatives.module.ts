import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactRepsService } from './contact-representatives.service';
import { ContactRep } from './models/contact-representatives.model';
import { ContactRepsController } from './contact-representatives.controller';
import { CreateContactRepsStrategy } from './strategies/create-contact-representatives/create-contact-representatives.strategy';
import { UpdateContactRepsStrategy } from './strategies/update-contact-representatives/update-contact-representatives.strategy';

@Module({
  imports: [SequelizeModule.forFeature([ContactRep])],
  controllers: [ContactRepsController],
  providers: [
    ContactRepsService,
    CreateContactRepsStrategy,
    UpdateContactRepsStrategy,
  ],
})
export class ContactRepsModule {}
