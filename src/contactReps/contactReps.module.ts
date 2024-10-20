import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactRepsService } from './contactReps.service';
import { ContactRep } from './models/contactReps.model';
import { ContactRepsController } from './contactReps.controller';
import { CreateContactRepsStrategy } from './strategies/create-contact-rep/create-contact-rep.strategy';
import { UpdateContactRepsStrategy } from './strategies/update-contact-rep/update-contact-rep.strategy';
import { FindAllContactRepsStrategy } from './strategies/find-contact-rep/find-all.strategy';
import { FindContactRepsByEmailStrategy } from './strategies/find-contact-rep/find-by-email.strategy';
import { FindContactRepsByNameStrategy } from './strategies/find-contact-rep/find-by-name.strategy';
import { FindContactRepsByPhoneStrategy } from './strategies/find-contact-rep/find-by-phone.strategy';

@Module({
  imports: [SequelizeModule.forFeature([ContactRep])],
  controllers: [ContactRepsController],
  providers: [
    ContactRepsService,
    CreateContactRepsStrategy,
    UpdateContactRepsStrategy,
    FindAllContactRepsStrategy,
    FindContactRepsByEmailStrategy,
    FindContactRepsByNameStrategy,
    FindContactRepsByPhoneStrategy,
  ],
})
export class ContactRepsModule {}
