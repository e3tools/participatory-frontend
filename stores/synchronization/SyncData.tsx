import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useFrappeAuth } from '@/provider/frappe-auth';
import {
    useDeleteSubmissionCallback,
    useGetSubmissions,
} from '../SubmissionStore';
import { useFrappe } from '@/provider/frappe';

// See https://medium.com/@tusharkumar27864/best-practices-of-using-offline-storage-asyncstorage-sqlite-in-react-native-projects-dae939e28570

export default function SyncData() {
    const submissions = useGetSubmissions(); // this is a reactive store. Any change in the store will be detected here
    // const { accessToken } = useFrappeAuth();
    const { call, guestCall } = useFrappe();
    // const socket: Socket = io('ws://192.168.100.26:9000/participatory-site');
    const { accessToken, refreshAccessTokenAsync } = useFrappeAuth();
    const deleteSubmission = useDeleteSubmissionCallback();
    let socket: Socket = null; //  io('ws://192.168.100.26:3000');

    const ping = () => {
        socket.emit('ping');
    };

    useEffect(() => {
        socket = io('http://192.168.100.26:9000', {
            // autoConnect: true,
            // extraHeaders: {
            //     Authorization: 'token 565a72971d2e3d0:ad08ddf850db007',
            // },
            withCredentials: true,
            reconnectionAttempts: 5,
        });
        // socket.connect();

        socket.on('connect', () => console.log('Socket connected'));
        socket.on('connect_error', (error) => {
            console.log('Socket connection errors: ', error);
        });

        // listen to server pong response
        socket.on('pong', () => console.log('pong'));

        // listen to server pushing data to client
        socket.on('push data to client', (data) =>
            console.log('Incoming server data:.', data)
        );
    }, []);

    useEffect(() => {
        if (socket !== null) {
            socket.emit('ping');
            socket.emit('new submission', 'New submission');
        }
    }, [socket]);

    useEffect(() => {
        console.log('Submissions changed: ', submissions);
        const upSync = async () => {
            console.log("sync'n up");
            if (submissions?.length > 0) {
                const parsedSubmissions = submissions.map((submission) => {
                    return {
                        ...submission,
                        responseJson: JSON.parse(
                            JSON.parse(submission.responseJson)
                        ),
                    };
                });
                guestCall
                    .post(
                        'participatory_backend.api.save_engagement_entry_v2',
                        {
                            docs: parsedSubmissions,
                        }
                    )
                    .then((res) => {
                        res?.message?.ids?.map((id) => {
                            // for saved submissions, remove them from local storage
                            deleteSubmission(id);
                        });
                    })
                    .catch((error) => console.error(error));
            }
        };

        const downSync = async () => {
            console.log("sync'n down");
            // guestCall
            //     .post('participatory_backend.api.get_linked_fields_data', {})
            //     .then((res) => {
            //         console.log('res: ', res);
            //         // res?.message?.ids?.map((id) => {
            //         //     // for saved submissions, remove them from local storage
            //         //     deleteSubmission(id);
            //         // });
            //     })
            //     .catch((error) => console.error(error));
        };
        const runSync = async () => {
            await upSync();
            await downSync();
        };

        runSync();
    }, [call, submissions]);

    return (
        <View>
            <Text>Sync Data</Text>
        </View>
    );
}

const styles = StyleSheet.create({});
