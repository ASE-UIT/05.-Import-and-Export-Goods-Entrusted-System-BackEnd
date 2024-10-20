import { Employee } from "@/employees/models/employee.model";
import { Invoice } from "@/invoices/models/invoice.model";
import sequelize from "sequelize";
import { BelongsTo, BelongsToMany, Column, Default, ForeignKey, HasOne, Model, PrimaryKey, Table } from "sequelize-typescript";

export enum ContractStatus {
    ACTIVE = 'ACTIVE',
    PENDING = 'PENDING',
    TERMINATED = 'TERMIATED',
    EXPIRED = 'EXPIRED'
}


@Table({ tableName: 'contracts' })
export class Contract extends Model {
    @PrimaryKey
    @Default(sequelize.UUIDV4)
    @Column
    id: string;

    @Column
    startDate: Date;

    @Column
    endDate: Date;

    @Column
    status: ContractStatus;

    @Column
    contractDate: Date;

    @ForeignKey(() => Employee)
    @Column
    employeeId: string;

    @BelongsTo(() => Employee)
    employee: Employee;

    @HasOne(() => Invoice)
    invoice: Invoice;
}