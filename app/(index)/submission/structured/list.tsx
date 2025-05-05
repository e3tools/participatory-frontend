import { ThemedText } from '@/components/ThemedText';
import { zincColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { DocField } from '@/module/engage/types';
import { Button } from '@/module/ui/components/button';
import { useLocale } from '@/provider/translation';
import { useGetDocFields } from '@/stores/DocTypeStore';
import { useGetEngagements } from '@/stores/EngagementStore';
import { useGetSubmissions } from '@/stores/SubmissionStore';
import { Submission } from '@/stores/types';
import { arrayGroup } from '@/utils/array';
import { formatDateTime } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Switch,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

const JsonPropertyItem = (
    property: string,
    value: any,
    fields: DocField[],
    isTable: boolean = false
) => {
    const field = fields.find((label) => label.fieldname === property);
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
                flexDirection: 'row',
                gap: 5,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
            }}
        >
            <ThemedText
                type="defaultSemiBold"
                style={{
                    flexBasis: 100,
                    flexGrow: 0,
                    flexShrink: 0,
                }}
            >
                {fieldLabel}
            </ThemedText>
            <ThemedText type="default">{renderValue}</ThemedText>
        </View>
    );
};

const JsonObjectViewer = ({
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

    return (
        <View style={{ paddingVertical: 5 }}>
            {objectKeys.map((key, idx) => {
                const value = parsedItem[key];
                const isTable = Array.isArray(value);
                console.log('isTable ', isTable);
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

const SubmissionItem = ({
    submission,
    fields,
}: {
    submission: Submission;
    fields: DocField[];
}) => {
    return (
        <View>
            <JsonObjectViewer item={submission} fields={fields} />
        </View>
    );
};

const Engagement = ({
    engagementName,
    engagementForm,
    submissions,
}: {
    engagementName: string;
    engagementForm: string;
    submissions: Submission[];
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [activeSections, setActiveSections] = React.useState<number[]>([]);
    const [collapsed, setCollapsed] = React.useState(true);
    const engagementSubmissions = submissions.filter(
        (submission) => submission.engagement === engagementName
    );
    const fields = useGetDocFields(engagementForm);

    return (
        <View
            style={{
                backgroundColor: isDark ? zincColors[600] : zincColors[200],
            }}
        >
            <Accordion
                activeSections={activeSections}
                sections={engagementSubmissions}
                touchableComponent={TouchableOpacity}
                expandMultiple={true}
                renderHeader={(section, index, isActive) => (
                    <Animatable.View
                        duration={400}
                        style={[
                            styles.header,
                            isActive ? styles.active : styles.inactive,
                        ]}
                        transition="backgroundColor"
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 5,
                                justifyContent: 'space-between',
                            }}
                        >
                            <ThemedText style={[styles.subHeaderText]}>
                                {index + 1}. {formatDateTime(section.createdAt)}
                            </ThemedText>
                            <Ionicons
                                name={isActive ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color={isActive ? 'black' : 'gray'}
                            />
                        </View>
                    </Animatable.View>
                )}
                renderContent={(section, _, isActive) => (
                    <Animatable.View
                        duration={400}
                        style={[
                            styles.content,
                            isActive ? styles.active : styles.inactive,
                        ]}
                        transition="backgroundColor"
                    >
                        <SubmissionItem submission={section} fields={fields} />
                        {/* <Animatable.Text
                            animation={isActive ? 'bounceIn' : undefined}
                        >                          
                        </Animatable.Text> */}
                    </Animatable.View>
                )}
                duration={400}
                onChange={setActiveSections}
                renderAsFlatList={false}
            />
        </View>
    );
};

const ListEmptyComponent = () => {
    const router = useRouter();
    const { t } = useLocale();

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

export default function StructuredAccordionScreen() {
    const [activeSections, setActiveSections] = React.useState<number[]>([]);
    const [collapsed, setCollapsed] = React.useState(true);
    const [multipleSelect, setMultipleSelect] = React.useState(false);
    const submissions = useGetSubmissions();
    const { t } = useLocale();
    let sections = [];

    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Group submissions by engagement
    if (submissions.length > 0) {
        let groupedData = [];
        // The key is the engagement name
        groupedData = arrayGroup(submissions, 'engagement');
        console.log('groupedData ', groupedData);

        const res = [];
        // extract array keys
        Object.keys(groupedData).forEach((key) => {
            sections.push({
                name: key,
                submissions: groupedData[key],
            });
        });
    } else {
        sections = [];
    }

    if (submissions.length === 0) {
        return <ListEmptyComponent />;
    }

    return (
        <View>
            <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
                {t('SUBMISSIONS_PAGE.TITLE')}
            </ThemedText>
            <Accordion
                activeSections={activeSections}
                sections={sections}
                touchableComponent={TouchableOpacity}
                expandMultiple={true}
                renderHeader={(section, _, isActive) => (
                    <Animatable.View
                        duration={400}
                        style={[
                            styles.header,
                            isActive ? styles.active : styles.inactive,
                        ]}
                        transition="backgroundColor"
                    >
                        <ThemedText
                            style={[
                                styles.headerText,
                                {
                                    backgroundColor: isDark
                                        ? zincColors[600]
                                        : zincColors[200],
                                },
                            ]}
                        >
                            {section.name}
                            <ThemedText
                                type="default"
                                style={{ fontStyle: 'italic', fontSize: 12 }}
                            >
                                {`: ${section.submissions.length}`}{' '}
                                {t('SUBMISSIONS_PAGE.SUBMISSIONS')}
                            </ThemedText>
                        </ThemedText>
                    </Animatable.View>
                )}
                renderContent={(section, _, isActive) => {
                    const engagementForm =
                        section.submissions[0].engagement_form;
                    return (
                        <Animatable.View
                            duration={400}
                            style={[
                                // styles.content,
                                isActive ? styles.active : styles.inactive,
                            ]}
                            transition="backgroundColor"
                        >
                            <Engagement
                                engagementName={section.name}
                                submissions={section.submissions}
                                engagementForm={engagementForm}
                            />

                            <Animatable.Text
                                animation={isActive ? 'bounceIn' : undefined}
                            ></Animatable.Text>
                        </Animatable.View>
                    );
                }}
                duration={400}
                onChange={setActiveSections}
                renderAsFlatList={false}
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
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '300',
        marginBottom: 20,
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    subHeaderText: {
        textAlign: 'left',
        fontSize: 12,
        fontWeight: '500',
    },
    content: {
        padding: 20,
        backgroundColor: '#fff',
    },
    active: {
        backgroundColor: 'rgba(255,255,255,1)',
    },
    inactive: {
        backgroundColor: 'rgba(245,252,255,1)',
    },
    selectors: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    selector: {
        backgroundColor: '#F5FCFF',
        padding: 10,
    },
    activeSelector: {
        fontWeight: 'bold',
    },
    selectTitle: {
        fontSize: 14,
        fontWeight: '500',
        padding: 10,
    },
    multipleToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 30,
        alignItems: 'center',
    },
    multipleToggle__title: {
        fontSize: 16,
        marginRight: 8,
    },
});
