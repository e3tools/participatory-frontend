import { UserEntity, userTable } from '../schema';
import { LOCALDB } from '../database';
import { SelectedFields } from 'drizzle-orm//sqlite-core';
import { eq, SQL } from 'drizzle-orm';

const UserRepository = {
    async getUser(id: string): Promise<UserEntity | undefined> {
        try {
            return undefined;
        } catch (error) {
            console.log('Failed to get user: ', error);
        }
    },

    /**
     * Get users
     * @param fields 
     * @returns 
     * 
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
     */
    async getUsers<TSelection extends SelectedFields>(
        fields: TSelection = null
    ) {
        try {
            const res = await LOCALDB.select(userTable, fields);
            return res;
        } catch (error) {
            console.log('Failed to get user: ', error);
        }
    },

    /**
     * Insert new record
     * @param user
     * @returns
     */
    async insert(user: UserEntity) {
        try {
            return await LOCALDB.insert(userTable, {
                name: user.name,
                email: user.email,
                password: user.password,
                full_name: user.full_name,
            });
        } catch (error) {
            console.error('Failed to save user: ', error);
        }
    },

    /**
     * Update record
     * @param user
     * @returns
     */
    async update(user: UserEntity) {
        try {
            return await LOCALDB.update(
                userTable,
                {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    full_name: user.full_name,
                },
                eq(userTable.name, user.name),
                { name: userTable.name }
            );
        } catch (error) {
            console.error('Failed to update user: ', error);
        }
    },

    /**
     * Delete single record
     * @param user
     * @returns
     */
    async delete(user: UserEntity | string) {
        try {
            const where =
                typeof user == 'string'
                    ? eq(userTable.name, user)
                    : eq(userTable.name, user.name);
            return await LOCALDB.remove(userTable, where, {
                name: userTable.name,
            });
        } catch (error) {
            console.error('Failed to delete user: ', error);
        }
    },

    /**
     * Delete all records
     * @param user
     * @returns
     */
    async deleteAll() {
        try {
            return await LOCALDB.remove(userTable, undefined, {
                name: userTable.name,
            });
        } catch (error) {
            console.error('Failed to delete user: ', error);
        }
    },
} as const;

export default UserRepository;
