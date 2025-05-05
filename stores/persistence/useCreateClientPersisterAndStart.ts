import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    Content,
    MergeableStore,
    OptionalSchemas,
} from 'tinybase/with-schemas';
import { createClientPersister } from './createClientPersister';

export const useCreateClientPersisterAndStart = <
    Schemas extends OptionalSchemas
>(
    storeId: string,
    store: MergeableStore<Schemas>,
    initialValues?: string,
    then?: () => void
) =>
    (UiReact as UiReact.WithSchemas<Schemas>).useCreatePersister(
        store,
        // create the persister
        (store: MergeableStore<Schemas>) =>
            createClientPersister(storeId, store),
        [storeId],
        async (persister) => {
            let initialContent: Content<Schemas> | undefined = undefined;
            // check if there is initial content for newly created store
            try {
                initialContent = JSON.parse(initialValues);
            } catch (error) {
                console.log(error);
            }
            await persister.load();
            await persister.startAutoSave();

            persister.destroy(); //destroy the persister for now
            then?.();
        },
        [initialValues]
    );
