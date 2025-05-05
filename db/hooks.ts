import { useCallback, useEffect, useState } from 'react';
import { LOCALDB } from './database';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';

export default function useDatabase() {
    const [isDbLoadingComplete, setIsDBLoadingComplete] = useState(false);
    // const { success, error } = useMigrations(LOCALDB.db, migrations);

    useEffect(() => {
        const loadDb = async () => {
            try {
                LOCALDB.initializeDB();
                setIsDBLoadingComplete(true);
            } catch (error) {
                console.error('Error initializing database: ', error);
            }
        };
        loadDb();
    }, []);

    return isDbLoadingComplete;
}
