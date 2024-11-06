import { Freight } from '@/freight/models/freight.model';
import sequelize from 'sequelize';
import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';

@Table({
    tableName: 'lcl',
})
export class LCL extends Model {
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    lcl_id: string;

    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    cost: number;

    @ForeignKey(() => Freight)
    @AllowNull(false)
    @Column
    freight_id: string;

    @BelongsTo(() => Freight)
    freight: Freight
}
