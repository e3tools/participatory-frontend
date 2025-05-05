import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    createMergeableStore,
    NoTablesSchema,
    NoValuesSchema,
    OptionalSchemas,
    Value,
} from 'tinybase/with-schemas';
import { randomUUID } from 'expo-crypto';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';
import { useCreateServerSynchronizerAndStart } from './synchronization/useCreateServerSynchronizerAndStart';
import { useCallback, useEffect } from 'react';
import { useFrappeAuth } from '@/provider/frappe-auth';
import { useApiGet, useFrappe } from '@/provider/frappe';
import Toast from 'react-native-toast-message';
import { DocListStore } from './DocListStore';

const STORE_ID_PREFIX = 'DocListsStore';

// const VALUES_SCHEMA = {
//     name: { type: 'string' },
//     description: { type: 'string' },
// } as const;

const TABLES_SCHEMA = {
    doctypes: {
        name: { type: 'string' },
        values: { type: 'string' },
    },
} as const;

type Schemas = [typeof TABLES_SCHEMA, NoValuesSchema];

// type LinkFieldDocTypesValueId = keyof typeof VALUES_SCHEMA;
// type LinkFieldDocTypeCellId = keyof (typeof TABLES_SCHEMA)['items'];

const useStoreId = () => STORE_ID_PREFIX;

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
    useValue,
    useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;

// Returns a callback that adds a new linked doctype to the store
export const useAddDocListCallback = () => {
    const store = useStore(useStoreId());
    return useCallback(
        (name: string, isChild: boolean) => {
            const id = randomUUID();
            store.setRow('doctypes', id, {
                name,
                values: JSON.stringify({ isChild }),
            });
            return id;
        },
        [store]
    );
};

// A hook to make a copy of the values of a linked doctype
export const useValuesCopy = (
    id: string
): [string, (valuesCopy: string) => void] => [
    useCell('doctypes', id, 'values', useStoreId()),
    useSetCellCallback(
        'doctypes',
        id,
        'values',
        (valuesCopy: string) => valuesCopy,
        [],
        useStoreId()
    ),
];

// Returns a callback that deletes a doctype from the store.
export const useDelDocListCallback = (doctype: string) =>
    useDelRowCallback('doctypes', doctype, useStoreId());

// Returns the IDs of all linked doctypes in the store.
export const useLinkFieldDocTypeIds = () => useRowIds('doctypes', useStoreId());

// Returns the (copy of) values of up to 10 items in the store.
export const useDocListsValues = () =>
    Object.values(useTable('doctypes', useStoreId()))
        .slice(0, 10)
        .map(({ name, values }) => {
            try {
                return { name, ...JSON.parse(values) };
            } catch {
                return { name };
            }
        });

// // Returns a pair of 1) a property of the shopping list, 2) a callback that
// // updates it, similar to the React useState pattern.
// export const useDocListValue = <ValueId extends DocListValueId>(
//     doctype: string,
//     valueId: ValueId
// ): [
//     Value<Schemas[1], ValueId>,
//     (value: Value<Schemas[1], ValueId>) => void
// ] => [
//     useValue(valueId, useStoreId(doctype)),
//     useSetValueCallback(
//         valueId,
//         (value: Value<Schemas[1], ValueId>) => value,
//         [],
//         useStoreId(doctype)
//     ),
// ];

// Create, persist, and sync a store containing simplified list of Doctype records
export const DocListsStore = () => {
    const { accessToken, refreshAccessTokenAsync } = useFrappeAuth();
    const { db, call, guestCall } = useFrappe();
    //const addDocList = useAddDocListCallback();

    const loadLinkFieldsData = useCallback(() => {
        guestCall
            .post('participatory_backend.api.get_linked_fields_data', {})
            .then((res) => {
                // console.log('res: ', res.message);
                Object.keys(res?.message).map((key) => {
                    console.log('Doctype: ', key);
                    const values = res?.message[key];
                    store.setRow('doctypes', key, {
                        name: key,
                        values: values.data,
                    });
                });
                console.log('Rows: ', store.getRowIds('doctypes'));
            })
            .catch((error) => console.error(error));
    }, [db]);

    useEffect(() => {
        if (guestCall !== null) {
            console.log('About to load doclists');
            loadLinkFieldsData();
        }
    }, [guestCall]);

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

    // In turn 'render' (i.e. create) all of the doctype lists themselves.
    // The useTable hook returns an object containing the data of a single Table in a Store, and registers a listener so that any changes to that result will cause a re-render
    return Object.entries(useTable('doctypes', storeId)).map(
        (X, y) => {
            console.log('Initializing doclist stores', X, y);
        }
        // ([name, values]) => {
        //     console.log('Creating doc list stores');
        //     return <DocListStore doctype={name} key={name} values={values} />;
        // }
    );
};
