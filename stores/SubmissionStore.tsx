import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    createMergeableStore,
    NoValuesSchema,
    OptionalSchemas,
} from 'tinybase/with-schemas';
import { useCreateClientPersisterAndStart } from './persistence/useCreateClientPersisterAndStart';
import { useCreateServerSynchronizerAndStart } from './synchronization/useCreateServerSynchronizerAndStart';
import { useCallback } from 'react';
import { randomUUID } from 'expo-crypto';
import { useUser } from '@/hooks/useUser';
import { transformObjectorArray } from '@/utils/common';
import { Submission, ENGAGEMENT_TYPE } from './types';

const storeId = 'SubmissionStore';

const VALUES_SCHEMA = {
    name: { type: 'string' },
    description: { type: 'string' },
} as const;

const TABLES_SCHEMA = {
    submission: {
        id: { type: 'string' },
        name: { type: 'string' },
        engagement: { type: 'string' },
        engagement_type: { type: 'string' },
        engagement_form: { type: 'string' },
        responseJson: { type: 'string' },
        isDraft: { type: 'boolean' },
        createdBy: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
    },
} as const;

type Schemas = [typeof TABLES_SCHEMA, NoValuesSchema];

type SubmissionCellId = keyof (typeof TABLES_SCHEMA)['submission'];

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
} = UiReact as UiReact.WithSchemas<Schemas>;

const useStoreId = () => storeId;

export const useAddStructuredSubmissionCallback = () => {
    const store = useStore(useStoreId());
    return useCallback(
        (engagement: string, responseJson: any, engagement_form?: string) => {
            const id = randomUUID();
            store.setRow('submission', id, {
                id,
                engagement,
                engagement_type: ENGAGEMENT_TYPE.Structured,
                engagement_form,
                responseJson: JSON.stringify(responseJson),
                isDraft: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: useUser() ?? '',
            });
        },
        [store]
    );
};

export const useGetSubmissions = () => {
    const res = useTable('submission'); //, useStoreId());
    return Object.values(useTable('submission', useStoreId()));
};

/**
 * Get submission associated with an engagement.
 * Only one draft submission per engagement can exist at a time
 * @param engagementId
 * Pn
 */
export const useGetDraftSubmissionByEngagement = (
    engagementId: string
): Submission | undefined => {
    const res = useTable('submission', useStoreId());
    const submissions = Object.values(res).filter(
        (el) => el.engagement === engagementId && el.isDraft === true
    );
    if (submissions.length == 0) {
        return null;
    }
    return transformObjectorArray(
        submissions.length > 0 ? submissions[0] : {},
        {}
    ) as Submission;
};

export const useDeleteSubmissionCallback = () => {
    const store = useStore(useStoreId());
    return useCallback(
        (id: string) => {
            store.delRow('submission', id);
        },
        [store]
    );
};

export const useDeleteSubmission = (id: string) => {
    useDelRowCallback('submission', id, useStoreId());
};

// Create, persist, and sync a store containing the engagements
export const SubmissionStore = () => {
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
