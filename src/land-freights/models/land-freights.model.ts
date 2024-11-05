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
  tableName: 'landFreight',
})
export class LandFreight extends Model {
  @ApiProperty()
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  land_freight_id: string;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_0_100: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_100_200: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_200_500: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_500_1500: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_1500_5000: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_5000_10000: number;

  @ApiProperty()
  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_10000: number;

  @ApiProperty()
  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freight_id: string

  @BelongsTo(() => Freight)
  freight: Freight;
}
