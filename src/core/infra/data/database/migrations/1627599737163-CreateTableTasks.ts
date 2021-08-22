import {
    MigrationInterface, 
    QueryRunner,
    Table,
    TableForeignKey
} from "typeorm";

export class CreateTableTasks1627599737163 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'tasks',
                columns: [
                                      {
                        name: 'uid',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                        isUnique: true,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                        length: '150',
                        isNullable: false,
                    },
                    {
                        name: 'user_uid',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: false,
                    },
                ],
                foreignKeys: [
                    new TableForeignKey({
                        referencedTableName: 'users',
                        referencedColumnNames: ['uid'],
                        columnNames: ['user_uid'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    }),
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tasks', true, true, true);
    }
}
