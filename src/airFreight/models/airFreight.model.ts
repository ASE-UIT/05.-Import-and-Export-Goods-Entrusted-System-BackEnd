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
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'airFreight',
})
export class AirFreight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  air_freight_id: string;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_0K: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_45K: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_100K: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_300K: number;

  @AllowNull(false)
  @Column({ type: DataType.FLOAT })
  price_500K: number;

  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freight_id: string;

  @BelongsTo(() => Freight)
  freight: Freight;
}
