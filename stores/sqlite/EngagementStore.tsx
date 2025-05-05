import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import { useFrappe } from '@/provider/frappe';
import EngagementRepository from '@/db/repository/engagement';

export default function EngagementStore() {
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
                    // EngagementRepository.insert  store.setRow('engagement', id, el);
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
    return (
        <View>
            <Text>EngagementStore</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
