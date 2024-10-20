import sequelize from 'sequelize';
import { Freight } from '@/freight/models/freight.model';
import {
  Column,
  BelongsTo,
  AllowNull,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'landFreight',
})
export class LandFreight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  land_freight_id: string;

  @AllowNull(false)
  @Column
  weight: number;

  @AllowNull(false)
  @Column
  price_100_200: number;

  @AllowNull(false)
  @Column
  price_200_500: number;

  @AllowNull(false)
  @Column
  price_500_1500: number;

  @AllowNull(false)
  @Column
  price_1500_5000: number;

  @AllowNull(false)
  @Column
  price_5000_10000: number;

  @AllowNull(false)
  @Column
  price_10000: number;

  // @ForeignKey(() => Freight)
  // @AllowNull(false)
  // @Column
  // freight_id: string;

  // @BelongsTo(() => Freight)
  // freight: Freight;
}
