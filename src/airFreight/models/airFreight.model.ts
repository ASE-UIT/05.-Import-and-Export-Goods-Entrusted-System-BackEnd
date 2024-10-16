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
  tableName: 'airFreight',
})
export class AirFreight extends Model {
  @PrimaryKey
  @Default(sequelize.UUIDV4)
  @Column
  air_freight_id: string;

  @ForeignKey(() => Freight)
  @AllowNull(false)
  @Column
  freight_id: string;

  @BelongsTo(() => Freight)
  freight: Freight;

  @AllowNull(false)
  @Column
  '45K': number;

  @AllowNull(false)
  @Column
  '100K': number;

  @AllowNull(false)
  @Column
  '300K': number;

  @AllowNull(false)
  @Column
  '500K': number;

  @AllowNull(false)
  @Column
  FSC: number;

  @AllowNull(false)
  @Column
  AMS_Fees: number;

  @AllowNull(false)
  @Column
  SCC: string;

  @AllowNull(false)
  @Column
  routine: string;
}
