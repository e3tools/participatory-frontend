import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    Image,
    RefreshControl,
    ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { Button } from '@/module/ui/components/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocale } from '@/provider/translation';
import { useFrappe } from '@/provider/frappe';
import { useFrappeAuth } from '@/provider/frappe-auth';
import Toast from 'react-native-toast-message';
import { useGetEngagements } from '@/stores/EngagementStore';
import { Engagement } from '@/stores/types';

export default function EngagementListScreen() {
    const router = useRouter();
    const { t } = useLocale();
    const [engagements, setEngagements] = useState(useGetEngagements());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const defaultImage =
        'https://images.unsplash.com/photo-1575893240675-17e719ffa7c5?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    const EngagementItem = ({ item }: { item: Engagement }) => {
        return (
            <Pressable
                onPress={() =>
                    router.push(`/engagement/details?name=${item.name}`)
                }
            >
                <View style={styles.container}>
                    <ThemedText type="subtitle" style={styles.title}>
                        {item.engagement_name}
                    </ThemedText>
                    <Image
                        style={styles.banner}
                        source={{
                            uri: item.cover_image || defaultImage,
                        }}
                    />
                    <View>
                        <ThemedText style={styles.description}>
                            {item.description}
                        </ThemedText>
                    </View>

                    <View style={styles.footerContainer}>
                        <ThemedText type="default" style={styles.closingDate}>
                            {item.closing_date}
                        </ThemedText>
                        <Button
                            variant="filled"
                            size="sm"
                            onPress={() => {
                                router.push({
                                    pathname:
                                        '/(index)/submission/structured/new',
                                    params: {
                                        engagementId: item.name,
                                        submissionId: null,
                                    },
                                });
                            }}
                        >
                            {t('ENGAGEMENT_LIST_PAGE.BUTTON.ADD_SUBMISSION')}
                        </Button>
                    </View>
                </View>
            </Pressable>
        );
    };

    const ListEmptyComponent = () => {
        return (
            <View style={styles.emptyListContainer}>
                <Ionicons name="sad-outline" size={64} />
                <ThemedText
                    style={{ textAlign: 'justify', alignSelf: 'center' }}
                >
                    {t('ENGAGEMENT_LIST_PAGE.NO_DATA')}
                </ThemedText>
            </View>
        );
    };

    const onRefresh = async () => {
        setIsRefreshing(true);
        // @TODO do data refresh here
        const data = useGetEngagements();
        setEngagements(data);
        console.log('Data refreshed');
        // setTimeout(() => {
        //     console.log('Data refreshed');

        //     setIsRefreshing(false);
        // }, 2000);
    };

    return (
        <View style={styles.body}>
            <FlatList
                data={engagements}
                renderItem={EngagementItem}
                keyExtractor={(item) => item.name}
                ListEmptyComponent={ListEmptyComponent}
                initialNumToRender={3}
                ListHeaderComponent={() => (
                    <ThemedText type="defaultSemiBold" style={styles.pageIntro}>
                        {t('ENGAGEMENT_LIST_PAGE.INTRODUCTION')}
                    </ThemedText>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    body: { padding: 10 },
    pageIntro: {
        textAlign: 'justify',
        marginBottom: 10,
        fontWeight: 'bold',
        paddingHorizontal: 10,
    },
    emptyListContainer: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 10,
    },
    container: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
    },
    title: {
        textAlign: 'center',
        paddingVertical: 5,
    },
    banner: {
        height: 150,
        width: '100%',
    },
    description: {
        textAlign: 'justify',
        paddingVertical: 5,
        textOverflow: 'elipsis',
        overflow: 'hidden',
        maxHeight: 100,
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: 10,
        paddingBottom: 10,
    },
    closingDate: {
        fontSize: 12,
        color: '#888',
    },
});
