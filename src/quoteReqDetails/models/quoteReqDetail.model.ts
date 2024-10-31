import { PackageDetail } from "@/packageDetails/models/packageDetails.model";
import { QuotationReq } from "@/quotationReqs/models/quotationReq.model";
import sequelize from "sequelize";
import { AllowNull, BelongsTo, Column, Default, ForeignKey, HasMany, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: "quote_req_details"
})
export class QuoteReqDetail extends Model {
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    id: string

    @AllowNull(false)
    @Column
    origin: string

    @AllowNull(false)
    @Column
    destination: string

    @AllowNull(false)
    @Column
    shipmentReadyDate: Date

    @AllowNull(false)
    @Column
    shipmentDeadline: Date

    @AllowNull(false)
    @Column
    cargoInsurance: boolean

    // Associations
    @ForeignKey(() => QuotationReq)
    @AllowNull(false)
    @Column
    quoteReqId: string

    @BelongsTo(() => QuotationReq)
    quotationReq: QuotationReq

    @HasOne(() => PackageDetail)
    packageDetails: PackageDetail
}