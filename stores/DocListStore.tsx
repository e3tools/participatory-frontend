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

const STORE_ID_PREFIX = 'DocListStore';
const useStoreId = (doctype: string) => STORE_ID_PREFIX + doctype;

const VALUES_SCHEMA = {
    name: { type: 'string' },
    description: { type: 'string' },
} as const;

const TABLES_SCHEMA = {
    items: {
        name: { type: 'string' },
        title: { type: 'string' },
    },
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];

type DocListValueId = keyof typeof VALUES_SCHEMA;
type DocListCellId = keyof (typeof TABLES_SCHEMA)['items'];

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

// const useStoreId = () => storeId;

// export const useDocListValue =  <ValueId extends DocListValueId>(doctype: string, valueId: ValueId): [Value<Schemas[i], ValueId>, ()] => {

// }

// Returns a pair of 1) a property of the shopping list, 2) a callback that
// updates it, similar to the React useState pattern.
export const useDocListValue = <ValueId extends DocListValueId>(
    doctype: string,
    valueId: ValueId
): [
    Value<Schemas[1], ValueId>,
    (value: Value<Schemas[1], ValueId>) => void
] => [
    useValue(valueId, useStoreId(doctype)),
    useSetValueCallback(
        valueId,
        (value: Value<Schemas[1], ValueId>) => value,
        [],
        useStoreId(doctype)
    ),
];

// Returns a callback that adds a new product to the shopping list.
export const useAddDocListItemCallback = (doctype: string) => {
    const store = useStore(useStoreId(doctype));
    return useCallback(
        (name: string, title: string) => {
            const id = randomUUID();
            store.setRow('items', id, {
                //   id,
                name,
                title,
            });
            return id;
        },
        [store, doctype]
    );
};

// Returns the IDs of all items in the store.
export const useDocListIds = (doctype: string) =>
    useRowIds('items', useStoreId(doctype));

// Returns the (copy of) values of up to 10 items in the store.
export const useDocListsValues = (doctype: string) =>
    Object.values(useTable('items', useStoreId(doctype)))
        .slice(0, 10)
        .map(({ name, title }) => {
            try {
                return { name, title }; // JSON.parse(valuesCopy);
            } catch {
                return {};
            }
        });

// Create, persist, and sync a store containing simplified list of Doctype records
export const DocListStore = ({
    doctype,
    values,
}: {
    doctype: string;
    values;
}) => {
    const storeId = useStoreId(doctype);
    // Create a store with the schema
    const store = useCreateMergeableStore(() =>
        createMergeableStore().setSchema(TABLES_SCHEMA)
    );

    console.log('Creatring doclist store:', doctype);
    //     // Debounce the setValuesCopy callback to prevent excessive re-renders.
    //   const debouncedSetValuesCopy = useCallback(
    //     debounce((values) => {
    //       setValuesCopy(values)
    //     }, 300),
    //     [setValuesCopy],
    //   )

    //   // Add listener to values for updating the parent 'lists store' copy.
    //   useValuesListener(
    //     () => {
    //       // BUG FIX: The previous implementation update only the store values
    //       // which would clear all existing table data when only values were updated.
    //       // Now we properly parse both tables and values from initialValues
    //       // to maintain table data integrity across updates.
    //       const storeData = {
    //         tables: {
    //           products: store.getTable('products'),
    //           collaborators: store.getTable('collaborators'),
    //         },
    //         values: {
    //           ...store.getValues(),
    //           listId,
    //         },
    //       }
    //       debouncedSetValuesCopy(JSON.stringify(storeData))
    //     },
    //     [debouncedSetValuesCopy],
    //     false,
    //     store,
    //   )

    // persist store with initial content if it has not been saved before
    useCreateClientPersisterAndStart(storeId, store, '', () => {
        // load data from backend
    });

    // useCreateServerSynchronizerAndStart(storeId, store);// disable synchronization for now
    useProvideStore(storeId, store); // Add store by id to a provider dynamically

    return null;
};
