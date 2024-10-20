import { Invoice } from "@/invoices/models/invoice.model";
import sequelize from "sequelize";
import { AllowNull, BelongsTo, Column, Default, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";

export enum PaymentStatus {
    COMPLETED = 'COMPLETED',
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    ONHOLD = 'ONHOLD'
}


@Table({
    tableName: "payments"
})
export class Payment extends Model {
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    id: string;

    @Default(0.0)
    @Column
    amountPaid: number;

    @Column
    status: PaymentStatus;

    @ForeignKey(() => Invoice)
    @AllowNull(false)
    @Column
    invoiceId: string;

    @BelongsTo(() => Invoice)
    invoice: Invoice;
}