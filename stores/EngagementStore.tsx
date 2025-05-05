import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    createMergeableStore,
    NoValuesSchema,
    OptionalSchemas,
} from 'tinybase/with-schemas';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';
import { useCreateServerSynchronizerAndStart } from './synchronization/useCreateServerSynchronizerAndStart';
import { useCallback, useEffect } from 'react';
import { useFrappeAuth } from '@/provider/frappe-auth';
import { useApiGet, useFrappe } from '@/provider/frappe';
import Toast from 'react-native-toast-message';

const storeId = 'EngagementStore';

const VALUES_SCHEMA = {
    name: { type: 'string' },
    description: { type: 'string' },
} as const;

const TABLES_SCHEMA = {
    engagement: {
        name: { type: 'string' },
        engagement_name: { type: 'string' },
        engagement_form: { type: 'string' },
        engagement_type: { type: 'string' },
        description: { type: 'string' },
        cover_image: { type: 'string' },
        closing_date: { type: 'string' },
        has_data_forms: { type: 'boolean' },
        has_discussion_forum: { type: 'boolean' },
        has_formal_submissions: { type: 'boolean' },
        has_guestbook: { type: 'boolean' },
        has_ideas: { type: 'boolean' },
        has_map: { type: 'boolean' },
        has_qa: { type: 'boolean' },
        include_quick_poll: { type: 'boolean' },
        is_published: { type: 'boolean' },
        question: { type: 'string' },
        quick_poll: { type: 'string' },
        status: { type: 'string' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    },
} as const;

type Schemas = [typeof TABLES_SCHEMA, NoValuesSchema];

type EngagementCellId = keyof (typeof TABLES_SCHEMA)['engagement'];

const {
    useCell,
    useCreateMergeableStore,
    useDelRowCallback,
    useProvideStore,
    useRowIds,
    useSetCellCallback,
    useSortedRowIds,
    useStore,
    useTable,
    useRow,
} = UiReact as UiReact.WithSchemas<Schemas>;

const useStoreId = () => storeId;

export const useGetEngagements = () => {
    return Object.values(useTable('engagement', useStoreId()));
};

export const useGetEngagement = (engagementId: string) => {
    const res = useRow('engagement', engagementId, useStoreId());
    return res;
};

// Create, persist, and sync a store containing the engagements
export const EngagementStore = () => {
    const { accessToken, refreshAccessTokenAsync } = useFrappeAuth();
    const { db, call } = useFrappe();

    const loadEngagements = useCallback(() => {
        // const res = useApiGet('participatory_backend.api.get_list', {
        //     fields: '*',
        //     orderBy: { field: 'creation', order: 'desc' },
        //     doctype: 'Engagement',
        // });
        // console.log('Called engagements 2: ', res.message);

        call.post('participatory_backend.api.get_list', {
            fields: '*',
            filters: [['name', '=', 'General Engagement']],
            orderBy: { field: 'creation', order: 'desc' },
            doctype: 'Engagement',
        })
            .then((res) => {
                res?.message?.map((el) => {
                    const id = el.name;
                    store.setRow('engagement', id, el);
                });
            })
            .catch((error) => console.error(error));

        /*
        db.getDocList('Engagement', {
            fields: '*',
            orderBy: { field: 'creation', order: 'desc' },
        })
            .then((res) => {
                res?.map((el) => {
                    const id = el.name;
                    store.setRow('engagement', id, el);
                });
            })
            .catch(async (e) => {
                if (e.httpStatus === 403 || e.httpStatus === 401) {
                    await refreshAccessTokenAsync();
                } else {
                    console.error(e);
                    Toast.show({
                        type: 'error',
                        position: 'top',
                        text1: 'Error',
                        text2: e.message,
                    });
                }
            })
            .finally(() => {});*/
    }, [db]);

    useEffect(() => {
        if (db !== null) {
            loadEngagements();
        }
    }, [accessToken, db]);

    const storeId = useStoreId();
    // Create a store with the schema
    const store = useCreateMergeableStore(() =>
        createMergeableStore().setTablesSchema(TABLES_SCHEMA)
    );

    // persist store with initial content if it has not been saved before
    useCreateClientPersisterAndStart(storeId, store, '', () => {
        // load data from backend
    });

    // useCreateServerSynchronizerAndStart(storeId, store);// disable synchronization for now
    useProvideStore(storeId, store); // Add store by id to a provider dynamically

    return null;
};
