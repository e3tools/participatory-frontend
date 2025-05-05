import {
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useGetSubmissions } from '@/stores/SubmissionStore';
import { ThemedText } from '@/components/ThemedText';
import { FlatList } from 'react-native';
import JSONTree from 'react-native-json-tree';
import { Ionicons } from '@expo/vector-icons';
import { useLocale } from '@/provider/translation';
import { Button } from '@/module/ui/components/button';
import { useRouter } from 'expo-router';
import { arrayGroup } from '@/utils/array';
import { FieldLabel, Submission } from '@/stores/types';
import { zincColors } from '@/constants/Colors';
import { DocField } from '@/module/engage/types';
import { useGetDocFields } from '@/stores/DocTypeStore';
import Accordion from 'react-native-collapsible/Accordion';

export default function StructuredSubmissionsListScreen() {
    const submissions = useGetSubmissions();
    // const [data, setData] = React.useState([]);
    let data = [];
    const { t } = useLocale();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    if (submissions.length > 0) {
        let groupedData = [];
        groupedData = arrayGroup(submissions, 'engagement');
        console.log('groupedData ', groupedData);

        const res = [];
        // extract array keys
        Object.keys(groupedData).forEach((key) => {
            res.push({
                title: key,
                data: groupedData[key],
            });
        });
        data = res;
    } else {
        data = [];
    }

    const ListEmptyComponent = () => {
        return (
            <View style={styles.emptyListContainer}>
                <Ionicons name="happy-outline" size={64} />
                <ThemedText
                    type="defaultSemiBold"
                    style={{ textAlign: 'justify', alignSelf: 'center' }}
                >
                    {t('ENGAGEMENT_LIST_PAGE.NO_DRAFT_SUBMISSIONS')}
                </ThemedText>
                <Button
                    variant="filled"
                    size="sm"
                    onPress={() => {
                        router.push({
                            pathname: '/engagement/list',
                        });
                    }}
                >
                    {t('ENGAGEMENT_LIST_PAGE.BUTTON.ADD_SUBMISSION')}
                </Button>
            </View>
        );
    };

    const renderFlatListItem = ({ item }: { item: any }) => {
        const parsedItem = {
            ...item,
            responseJson: JSON.parse(item.responseJson),
        };
        return (
            <View style={{ paddingVertical: 5 }}>
                <ThemedText type="defaultSemiBold">
                    {item.engagement_form}
                </ThemedText>
                <JSONTree data={item} />
            </View>
        );
    };

    const JsonPropertyItem = (
        property: string,
        value: any,
        fields: DocField[],
        isTable: boolean = false
    ) => {
        const field = fields.find((label) => label.fieldname === property);
        console.log('fields', field);
        let fieldLabel = property;
        if (field) {
            fieldLabel = field.label;
        }
        const renderValue = value;
        if (isTable) {
        }

        return (
            <View
                style={{
                    paddingVertical: 5,
                    flexDirection: 'column',
                    gap: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                }}
            >
                <ThemedText type="defaultSemiBold">{fieldLabel}</ThemedText>
                <ThemedText type="default">{renderValue}</ThemedText>
            </View>
        );
    };

    const JsonViewer = ({
        item,
        fields,
    }: {
        item: any;
        fields: DocField[];
    }) => {
        // run JSON.parse twice to get the object since the responseJson is a stringified JSON
        const parsedItem = JSON.parse(JSON.parse(item.responseJson));
        console.log('parsedItem', Object.keys(parsedItem));
        const objectKeys = Object.keys(parsedItem) || [];

        const [activeSections, setActiveSections] = React.useState<number[]>(
            []
        );

        const SECTIONS = [
            {
                title: 'First',
                content: 'Lorem ipsum...',
            },
            {
                title: 'Second',
                content: 'Lorem ipsum second...',
            },
        ];

        const _renderSectionTitle = (section) => {
            return (
                <View style={styles.content}>
                    <Text>{section.content}</Text>
                </View>
            );
        };

        const _renderHeader = (section) => {
            return (
                <View
                    style={[
                        styles.header,
                        {
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        },
                    ]}
                >
                    <Text style={styles.headerText}>{section.title}</Text>
                    <Button
                        variant="outlined"
                        onPress={() => {
                            console.log('pressed');
                        }}
                    >
                        {t('SUBMISSIONS_PAGE.BUTTONS.VIEW')}
                    </Button>
                </View>
            );
        };

        const _renderContent = (section) => {
            return (
                <View style={styles.content}>
                    <Text>{section.content}</Text>
                </View>
            );
        };

        const _updateSections = (activeSections) => {
            // this.setState({ activeSections });
            setActiveSections(activeSections);
        };

        return (
            <Accordion
                sections={SECTIONS}
                activeSections={activeSections}
                renderSectionTitle={_renderSectionTitle}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
            />
        );

        return (
            <View style={{ paddingVertical: 5 }}>
                <ThemedText type="defaultSemiBold">
                    {item.engagement_form}
                </ThemedText>
                {objectKeys.map((key, idx) => {
                    const value = parsedItem[key];
                    const isTable = Array.isArray(value);
                    if (isTable) {
                        return (
                            <View key={key}>
                                {JsonPropertyItem(key, value, fields, true)}
                                {value.map((item: any) => {
                                    return (
                                        <View
                                            key={item.name}
                                            style={{
                                                paddingLeft: 20,
                                                paddingVertical: 5,
                                            }}
                                        >
                                            {Object.keys(item).map((key) => {
                                                return JsonPropertyItem(
                                                    key,
                                                    item[key],
                                                    fields
                                                );
                                            })}
                                        </View>
                                    );
                                })}
                            </View>
                        );
                    } else {
                        return JsonPropertyItem(key, value, fields);
                    }
                })}
            </View>
        );
    };

    const renderItem = ({ item }: { item: Submission }) => {
        const fields = useGetDocFields(item.engagement_form);
        return (
            <View style={styles.item}>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        justifyContent: 'space-between',
                    }}
                >
                    <ThemedText>{item.engagement_form}</ThemedText>
                    <Button variant="outlined" onPress={() => {}}>
                        {t('SUBMISSIONS_PAGE.BUTTONS.VIEW')}
                    </Button>
                </View>
                <View>
                    <JsonViewer item={item} fields={fields} />
                    {/* <JSONTree
                    data={JSON.parse(item.responseJson)}
                    // theme={{
                    //     scheme: isDark ? 'twilight' : 'solarized',
                    //     base00: isDark ? '#000' : '#fff',
                    //     base01: isDark ? '#000' : '#fff',
                    // }}
                    // invertTheme={isDark}
                    // hideRoot
                    labelRenderer={(raw) => (
                        <Text style={{ fontWeight: 'bold' }}>{raw}</Text>
                    )}
                    // valueRenderer={raw => <Text style={{ fontStyle: 'italic' }}>{raw}</Text>}
                /> */}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 10,
                        justifyContent: 'space-between',
                    }}
                >
                    <ThemedText>{item.createdAt || 'TTT'}</ThemedText>
                </View>
            </View>
        );
    };

    const renderHeader = ({ section }: { section: any }) => {
        return (
            <View
                style={[
                    StyleSheet.flatten([
                        styles.header,
                        {
                            backgroundColor: isDark
                                ? zincColors[600]
                                : zincColors[200],
                        },
                    ]),
                ]}
            >
                <ThemedText style={styles.headerTitle}>
                    {section.title}
                </ThemedText>
            </View>
        );
    };

    // useEffect(() => {
    //     console.log('submissions changed', submissions);
    //     if (submissions.length > 0) {
    //         let groupedData = [];
    //         groupedData = arrayGroup(submissions, 'engagement_form');
    //         console.log('groupedData', groupedData);

    //         const res = [];
    //         // extract array keys
    //         Object.keys(groupedData).forEach((key) => {
    //             res.push({
    //                 title: key,
    //                 data: groupedData[key],
    //             });
    //         });
    //         setData(res);
    //     } else {
    //         setData([]);
    //     }
    // }, [submissions]);

    return (
        <View>
            <SectionList
                sections={data}
                renderItem={renderItem}
                renderSectionHeader={renderHeader}
                ListEmptyComponent={ListEmptyComponent}
                keyExtractor={(item, index) => item.id + index}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
    item: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'column',
        gap: 5,
        // justifyContent: 'space-between',
    },
    title: {
        fontSize: 18,
    },
    header: {
        padding: 20,
        backgroundColor: zincColors[50], // '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
});
