import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";
import { query } from "express";
import { TableColumnOptions } from "typeorm/schema-builder/options/TableColumnOptions";

export class InitApplication1597105062410 implements MigrationInterface {

    idColumnOptions: TableColumnOptions = {
        name: 'id',
        type: 'varchar',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
    };

    creationalColumnOptions = [
        this.idColumnOptions,
        {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()'
        },
        {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()'
        }
    ]



    customerTable = new Table({
        name: 'customers',
        columns: [
            ...this.creationalColumnOptions,
            {
                name: 'name',
                type: 'varchar',
            },
            {
                name: 'email',
                type: 'varchar',
            },
        ]
    })

    productTable = new Table({
        name: 'products',
        columns: [
            ...this.creationalColumnOptions,
            {
                name: 'name',
                type: 'varchar',
            },
            {
                name: 'price',
                type: 'decimal',
                precision: 5,
                scale: 2
            },
            {
                name: 'quantity',
                type: 'smallint',
                default: '0',
            },
        ]
    });

    orderTable = new Table({
        name: 'orders',
        columns: [
            ...this.creationalColumnOptions,
            {
                name: 'customerId',
                type: 'varchar',
                isNullable: true,
            }
        ]
    });

    orderProductTable = new Table({
        name: 'orders_products',
        columns: [
            ...this.creationalColumnOptions,
            {
                name: 'orderId',
                type: 'varchar',
                isNullable: true,
            },
            {
                name: 'productId',
                type: 'varchar',
                isNullable: true,
            },
            {
                name: 'price',
                type: 'decimal',
                precision: 5,
                scale: 2
            },
            {
                name: 'quantity',
                type: 'smallint',
            }
        ]
    });


    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(this.customerTable);
        await queryRunner.createTable(this.productTable);
        await queryRunner.createTable(this.orderTable);
        await queryRunner.createTable(this.orderProductTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.orderProductTable);
        await queryRunner.dropTable(this.orderTable);
        await queryRunner.dropTable(this.productTable);
        await queryRunner.dropTable(this.customerTable);
    }

}
