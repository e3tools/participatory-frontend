import { Alert } from "react-native";
import { DB, LocalDB } from "./db";

export const resolveConflict = async (localDoc: any, serverDoc: any, doctype: string) => {
    return await _LastWriteWins(localDoc, serverDoc, doctype);
}

/**
 * In this strategy, the most recent change (based on a timestamp) is accepted as the final value when syncing data. 
 * May lead to data loss (e.g., if both users made significant changes).
 * Works well for non-critical data.
 * See https://dev.to/zidanegimiga/building-offline-first-applications-with-react-native-3626
 */
const _LastWriteWins = async (localDoc: any, serverDoc: any, doctype: string) => {
    let finalDoc = null;
    try {
         //compare timestamps
        if(localDoc.modified > serverDoc.modified) {
            // local copy is newer, so overwrite the server
            // const res = await DB.callApiEndpoint('sync_records', {
            //     docs: [localDoc],
            //     doctype: doctype 
            // }); 
            return localDoc;
        } else {
            // server copy is newer, so discard local changes 
            // await LocalDB.update(doctype, serverDoc);
            return serverDoc;
        }
    } catch (error) {
        console.error('Sync failed: ', localDoc, error);
    }
   return finalDoc;
}

/**
 * User is prompted to resolve conflicts when multiple versions of the same data exist
 * This approach is more user-friendly in scenarios where every change is valuable and users need to decide which data to keep.
 * If the updatedAt timestamps differ between the local and server versions, the app alerts the user and asks them to choose 
 * which version to keep. The user can decide whether to keep the local or server version.
 * @param localDoc 
 * @param serverDoc 
 * @param doctype 
 */
const _ManualConflictResolution = async (localDoc: any, serverDoc: any, doctype: string) => {
    try {
         //compare timestamps
        if(localDoc.modified !== serverDoc.modified) {
            // conflict detected. Ask the user to resolve it
            Alert.alert('Document Conflict',
                'Both you and another user have edited this document. Choose which version to keep.',
                [
                    {
                        text: 'Keep Local',
                        onPress: async () => {
                            // Overwrite the server with local changes
                            const res = await DB.callApiEndpoint('sync_records', {
                                docs: [localDoc],
                                doctype: doctype 
                            }); 
                        }
                    },
                    {
                        text: 'Keep Server',
                        onPress: async () => {
                            // Discard local changes and update with server changes
                            await LocalDB.update(doctype, serverDoc);
                        }
                    }
                ]
            )
        } else {
            // no conflict, proceed with syncing
            await LocalDB.update(doctype, serverDoc) 
        }
    } catch (error) {
        console.error('Sync failed: ', localDoc, error);
    }
}