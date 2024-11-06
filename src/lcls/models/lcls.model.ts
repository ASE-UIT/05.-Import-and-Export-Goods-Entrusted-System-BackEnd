import { Freight } from '@/freights/models/freights.model';
import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty()
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    lcl_id: string;

    @ApiProperty()
    @AllowNull(false)
    @Column({ type: DataType.FLOAT })
    cost: number;

    @ApiProperty()
    @ForeignKey(() => Freight)
    @AllowNull(false)
    @Column
    freight_id: string;

    @BelongsTo(() => Freight)
    freight: Freight
}
