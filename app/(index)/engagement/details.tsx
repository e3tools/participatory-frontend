import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/module/ui/components/button';
import { useLocale } from '@/provider/translation';
import { useRouter } from 'expo-router';

interface CardComponentProps {
    item: any;
}

export function CardComponent({ item }: CardComponentProps) {
    const { t } = useLocale();
    const router = useRouter();

    return (
        <View style={styles.container}>
            <ThemedText type="subtitle" style={styles.title}>
                {item.name}
            </ThemedText>
            <Image
                style={styles.banner}
                source={{
                    uri: item.image,
                }}
            />
            <View>
                <ThemedText style={styles.description}>
                    {item.details}
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
                            pathname: '/(index)/submission/structured/new',
                            params: { engagementId: item.name },
                        });
                    }}
                >
                    {t('ENGAGEMENT_LIST_PAGE.BUTTON.ADD_SUBMISSION')}
                </Button>
            </View>
        </View>
    );
}

// const CardComponent = ({ item, onAddSubmission }: CardComponentProps) => {
//     return (
//         <View style={styles.container}>
//             <ThemedText type="subtitle" style={styles.title}>
//                 {item.name}
//             </ThemedText>
//             <Image
//                 style={styles.banner}
//                 source={{
//                     uri: item.image,
//                 }}
//             />
//             <View>
//                 <ThemedText style={styles.description}>
//                     {item.details}
//                 </ThemedText>
//             </View>

//             <View style={styles.footerContainer}>
//                 <ThemedText type="default" style={styles.closingDate}>
//                     {item.closing_date}
//                 </ThemedText>
//                 <Button variant="filled" size="sm" onPress={() => onAddSubmission()}>
//                     {t('ENGAGEMENT_LIST_PAGE.ADD_SUBMISSION')}
//                 </Button>
//             </View>
//         </View>
//     );
// };

export default function EngagementDetailScreen() {
    const engagement = {
        name: 'Engagement 1',
        details:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt doloremque, eius quod aperiam alias porro consectetur, veritatis cum cumque necessitatibus modi ad recusandae dolores. Beatae distinctio pariatur dicta facere veritatis?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt doloremque, eius quod aperiam alias porro consectetur, veritatis cum cumque necessitatibus modi ad recusandae dolores. Beatae distinctio pariatur dicta facere veritatis?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt doloremque, eius quod aperiam alias porro consectetur, veritatis cum cumque necessitatibus modi ad recusandae dolores. Beatae distinctio pariatur dicta facere veritatis?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt doloremque, eius quod aperiam alias porro consectetur, veritatis cum cumque necessitatibus modi ad recusandae dolores. Beatae distinctio pariatur dicta facere veritatis?. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt doloremque, eius quod aperiam alias porro consectetur, veritatis cum cumque necessitatibus modi ad recusandae dolores. Beatae distinctio pariatur dicta facere veritatis?.',
        closing_date: '2023-12-31',
        status: 'active',
        submission_count: 5,
        image: 'https://images.unsplash.com/photo-1575893240675-17e719ffa7c5?q=80&w=2912&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    };

    return (
        <BodyScrollView>
            <CardComponent item={engagement} />
        </BodyScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    title: {
        textAlign: 'center',
        paddingVertical: 5,
    },
    banner: {
        height: 200,
        width: '100%',
    },
    description: {
        textAlign: 'justify',
        paddingVertical: 5,
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    closingDate: {
        fontSize: 12,
        color: '#888',
    },
});
