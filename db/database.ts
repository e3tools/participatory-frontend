import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations, migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import {
    SelectedFields,
    SQLiteSelectBuilder,
    SQLiteTable,
} from 'drizzle-orm/sqlite-core';
import { SQL, sql } from 'drizzle-orm';

const DATABASE_NAME = 'engage';
const expoDb = SQLite.openDatabaseSync(DATABASE_NAME);
const db = drizzle(expoDb);

/**
 * Initialize DB including running migrations
 * @returns
 */
const initializeDB = () => {
    // Initialize db and run migrations
    // const { success, error } = useMigrations(db, migrations);
    try {
        migrate(db, migrations);
        console.log('Migration completed');
    } catch (error) {
        console.error('Migration failed :', error.message);
    }
};

/**
 * Delete records in the table
 * E.g db.delete(users).where(eq(users.name, 'Dan'));
 * @param table
 * @param where e.g eq(users.name, 'Dan');
 * @returns
 */
const remove = async <TTable extends SQLiteTable>(
    table: TTable,
    where?: SQL | undefined,
    returnFields?: TTable['$inferSelect']
) => {
    const res = await db.transaction(
        async (tx) => {
            return where
                ? tx.delete(table).where(where).returning()
                : tx.delete(table).returning(returnFields);
        },
        {
            behavior: 'immediate', // 'deferred',
        }
    );
    return res;
};

/**
 * Insert new record into the db
 * @param table
 * @param values
 */
const insert = async <TTable extends SQLiteTable>(
    table: TTable,
    values: TTable['$inferInsert']
) => {
    const res = await db.transaction(
        async (tx) => {
            return tx.insert(table).values(values).returning();
        },
        {
            behavior: 'immediate',
        }
    );
    return res;
};

/**
 * Update an existing record
 * @param table
 * @param values
 * @param where
 * @param returnFields
 * @returns
 */
const update = async <TTable extends SQLiteTable>(
    table: TTable,
    values: TTable['$inferInsert'],
    where: SQL | undefined,
    returnFields?: TTable['$inferSelect']
) => {
    const res = await db.transaction(
        async (tx) => {
            return tx
                .update(table)
                .set(values)
                .where(where)
                .returning(returnFields);
        },
        {
            behavior: 'immediate',
        }
    );
    return res;
};

/**
 * Select records from table
    
    * To get all fields call getUsers()
    * To get specific fields e.g name and full_name, call getUsers({
            name: userTable.name,
            full_name: userTable.full_name
        })
    *  You can also alias fields e.g name and full_name, call getUsers({
            id: userTable.name,
            userFullName: userTable.full_name
        })
    In this case, the returned objects will have the aliased field names
 * @param table
 * @param values
 */
const select = async <
    TTable extends SQLiteTable,
    TSelection extends SelectedFields
>(
    table: TTable,
    fields: TSelection = null
) => {
    return fields
        ? await db.select(fields).from(table)
        : await db.select().from(table);
};

// /**
//  * Drop table from db
//  * @param tableName
//  COMMENTED as it is better to handle DROP table using the migrations. Drizzle auto-handles drop table when a table is deleted from the schema
//  */
// const dropTable = async (tableName: string) => {
//     await db.transaction(async (tx) => {
//         tx.run(sql`drop table ${tableName}`);
//     });
// };

export const LOCALDB = {
    db,
    initializeDB,
    //dropTable,
    remove,
    insert,
    update,
    select,
    DATABASE_NAME,
};
