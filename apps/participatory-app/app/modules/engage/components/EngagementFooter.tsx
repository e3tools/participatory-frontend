import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IDBReadParam } from 'data-layer/interfaces/database'; //from '@/app/interfaces/database';
import { useNavigation } from 'expo-router';
import { DocTypeService } from 'data-layer/services/doctype';
import { theme } from 'ui/components/theme/theme';
import { APP } from 'common';
import { DOCTYPES } from '../../../constants/enums';
import { AppIconButton } from 'ui/components/shared/app-icon-button';
import { Engagement } from '@/app/state/state.types';

const EngagementFooter = ({ engagement }: { engagement: Engagement }) => {
  const navigation = useNavigation();
  const [total_drafts, setTotalDrafts] = useState(0);
  const [total_submissions, setTotalSubmissions] = useState(0);
  let cfg = {} as IDBReadParam;
  const db = new DocTypeService('Engagement Entry');
  cfg.filters = [
    ['status', '=', 'Submitted'],
    ['docstatus', '!=', 2],
    ['engagement', '=', engagement.name],
  ];
  cfg.fields = ['*']; // ['name', 'engagement_name', 'engagement_type', 'engagement_template', 'administration_level']

  useEffect(() => {
    const get_count = async (status: string) => {
      let cfg = {} as IDBReadParam;
      cfg.filters = [
        ['status', '=', status],
        ['docstatus', '!=', 2],
        ['engagement', '=', engagement.name],
      ];
      return await db.get_count(cfg);
    };
    const getTotalSubmissions = async () => {
      let count = await get_count('Submitted');
      setTotalSubmissions(count);
    };

    const getTotalDrafts = async () => {
      let count = await get_count('Draft');
      setTotalDrafts(count);
    };

    getTotalSubmissions();
    getTotalDrafts();
  }, []);

  return (
    <View style={styles.bottom_actions_container}>
      <Text style={styles.submissions}>
        {total_submissions}{' '}
        {APP._('ENGAGEMENT_LIST_PAGE.FINALIZED_SUBMISSIONS')}
      </Text>
      {total_drafts ? (
        <Text style={styles.submissions}>
          {total_drafts} {APP._('ENGAGEMENT_LIST_PAGE.DRAFT_SUBMISSIONS')}
        </Text>
      ) : null}
      <AppIconButton
        style={styles.list_view_button}
        label={APP._('ENGAGEMENT_LIST_PAGE.BUTTON.EXPLORE')}
        icon="page-next-outline"
        mode="text"
        onPress={() => {
          APP.navigateToPath(navigation, 'views/list/[doctype]', {
            doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
            engagement: engagement.name,
            engagement_name: engagement.engagement_name,
          });
        }}
      />
    </View>
  );
};

export default EngagementFooter;

const styles = StyleSheet.create({
  bottom_actions_container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'flex-end',
    maxHeight: 40,
  },
  submissions: {
    fontWeight: '400',
    color: theme.colors.tertiary,
    flex: 5,
    paddingLeft: 10,
  },
  list_view_button: {
    flex: 1,
    width: 500,
    alignSelf: 'flex-end',
  },
});
