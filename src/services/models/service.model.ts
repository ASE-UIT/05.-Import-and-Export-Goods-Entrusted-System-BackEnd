import { QuotationService } from '@/quotation-services/models/quotation-services.model';
import { ApiProperty } from '@nestjs/swagger';
import sequelize from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  HasMany,
  Default,
  Unique,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'services', timestamps: true })
export class Service extends Model<Service> {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  id: string;

  @ApiProperty()
  @Unique({
    name: 'name_conflict',
    msg: 'This service name is already existed',
  })
  @Column
  name: string;

  @ApiProperty()
  @Column
  shortName: string;

  @ApiProperty()
  @Column({ type: DataType.FLOAT })
  fee: number;

  @HasMany(() => QuotationService)
  quotationServices: QuotationService[];
}
