import sequelize from 'sequelize';
import { Freight } from '@/freights/models/freights.model';
import {
  Column,
  BelongsTo,
  AllowNull,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

@Table({
  tableName: 'airFreight',
})
export class AirFreight extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  air_freight_id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_0K: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_45K: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_100K: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_300K: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_500K: number;

  @ApiProperty()
  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freight_id: string;

  @BelongsTo(() => Freight)
  freight: Freight;
}
