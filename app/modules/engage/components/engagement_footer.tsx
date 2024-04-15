import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { IDBReadParam } from '@/app/interfaces/database';
import { useNavigation } from 'expo-router';
import { DocTypeService } from '@/app/services/doctype';
import { theme } from '@/app/core/theme';
import { APP } from '@/app/utils/app';
import { DOCTYPES } from '@/app/constants/enums';
import { AppIconButton } from '@/app/components/shared/AppIconButton';

const EngagementFooter = ({ engagement }) => {
    const navigation = useNavigation();
    const [total_drafts, set_total_drafts] = useState(0);
    const [total_submissions, set_total_submissions] = useState(0);
    let cfg = {} as IDBReadParam;
    const db = new DocTypeService("Engagement Entry");
    cfg.filters = [['status', '=', 'Submitted'], ['docstatus', '!=', 2], ['engagement', '=', engagement.name]];
    cfg.fields = ["*"]// ['name', 'engagement_name', 'engagement_type', 'engagement_template', 'administration_level']
    
    const get_count = async (status: string) => {
        let cfg = {} as IDBReadParam; 
        cfg.filters = [['status', '=', status], ['docstatus', '!=', 2], ['engagement', '=', engagement.name]];
        return await db.get_count(cfg);
    }
    const get_total_submissions = async () => {
        let count = await get_count('Submitted'); 
        set_total_submissions(count)
    }

    const get_total_drafts = async () => {
        let count = await get_count('Draft'); 
        set_total_drafts(count)
    }

    useEffect(()=> {    
        get_total_submissions();
        get_total_drafts();
    }, [])

  return (
    <View style={styles.bottom_actions_container}>
        <Text style={styles.submissions}>{total_submissions} {APP._('ENGAGEMENT_LIST_PAGE.FINALIZED_SUBMISSIONS')}</Text>
        { total_drafts ?  <Text style={styles.submissions}>{total_drafts} {APP._('ENGAGEMENT_LIST_PAGE.DRAFT_SUBMISSIONS')}</Text> : null } 
        <AppIconButton style={styles.list_view_button} 
            label={APP._('ENGAGEMENT_LIST_PAGE.BUTTON.EXPLORE')} 
            icon='page-next-outline' 
            mode='text'
            on_press={() => {
            APP.navigate_to_path(navigation, 'views/list/[doctype]', {
              doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
              'engagement': engagement.name,
              'engagement_name': engagement.engagement_name
            });
        }} />
    </View>  
  )
}

export default EngagementFooter 

const styles = StyleSheet.create({
    bottom_actions_container: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
        alignItems: 'center',
        justifyContent: 'flex-end',
        maxHeight: 40
    },
    submissions: {
        fontWeight: '400',
        color: theme.colors.tertiary,
        flex: 5,
        paddingLeft: 10
    },
    list_view_button: {
        flex: 1,
        width: 500,
        alignSelf: 'flex-end'
    },
})