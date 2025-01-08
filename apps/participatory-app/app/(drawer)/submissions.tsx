import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AppContainer from 'ui/components/shared/app-container';
import {
  BarChart,
  LineChart,
  PieChart,
  pieDataItem,
} from 'react-native-gifted-charts';
import { DataTable, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { APP } from 'common';
import { formatDate } from 'common/utils/date';
import { getEngagementEntriesByUser } from '../state/engagementEntry/actions/engagementEntry.action';
import { arrayGroupBy } from 'common/utils/common';
import { useAuth } from '../providers/auth-provider';

const SubmissionsPage = () => {
  const dispatch = useAppDispatch();
  const submissions = useAppSelector((state) => state.engagementEntry.entries);
  const user = useAppSelector((state) => state.user.loggedInUser?.name);
  const { authToken, handleLogin } = useAuth();

  const [pieByEngagementData, setPieByEngagementData] = useState<pieDataItem[]>(
    [],
  );
  const [pieByYearData, setPieByYearData] = useState<pieDataItem[]>([]);

  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];
  const lineData = [
    { value: 0, dataPointText: '0' },
    { value: 10, dataPointText: '10' },
    { value: 8, dataPointText: '8' },
    { value: 58, dataPointText: '58' },
    { value: 56, dataPointText: '56' },
    { value: 78, dataPointText: '78' },
    { value: 74, dataPointText: '74' },
    { value: 98, dataPointText: '98' },
  ];

  const lineData2 = [
    { value: 0, dataPointText: '0' },
    { value: 20, dataPointText: '20' },
    { value: 18, dataPointText: '18' },
    { value: 40, dataPointText: '40' },
    { value: 36, dataPointText: '36' },
    { value: 60, dataPointText: '60' },
    { value: 54, dataPointText: '54' },
    { value: 85, dataPointText: '85' },
  ];

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 20]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0],
  );

  const [items] = React.useState([
    {
      key: 1,
      name: 'Cupcake',
      calories: 356,
      fat: 16,
    },
    {
      key: 2,
      name: 'Eclair',
      calories: 262,
      fat: 16,
    },
    {
      key: 3,
      name: 'Frozen yogurt',
      calories: 159,
      fat: 6,
    },
    {
      key: 4,
      name: 'Gingerbread',
      calories: 305,
      fat: 3.7,
    },
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    dispatch(getEngagementEntriesByUser(user || ''));
  }, [dispatch, user]);

  useEffect(() => {
    const groupByEngagement = arrayGroupBy(submissions, 'engagement_name');
    const groupByYear = arrayGroupBy(submissions, 'entered_on');
    // const groupByEngagement = Object.groupBy(
    //   submissions,
    //   (el: EngagementEntry) => el.engagement_name,
    // );
    // const groupByYear = Object.groupBy(submissions, (el: EngagementEntry) =>
    //   el.entered_on.getFullYear(),
    // );

    const groupByEngagementData: pieDataItem[] = [];
    Object.keys(groupByEngagement).map((key: any) => {
      groupByEngagementData.push({
        value: groupByEngagement[key]?.length || 0,
        text: key,
      });
    });

    const groupByYearData: pieDataItem[] = [];
    Object.keys(groupByYear).map((key: any) => {
      groupByYearData.push({
        value: groupByYear[key]?.length || 0,
        text: key,
      });
    });
    setPieByEngagementData(groupByEngagementData);
    setPieByYearData(groupByYearData);
  }, [submissions]);

  const pieData = [
    { value: 54, color: '#177AD5', text: '54%' },
    { value: 40, color: '#79D2DE', text: '30%' },
    { value: 20, color: '#ED6665', text: '26%' },
  ];

  return (
    <AppContainer>
      {authToken ? (
        <>
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              alignItems: 'center',
            }}
          >
            <BarChart data={data} />
            <Text variant="bodyLarge" style={{ fontWeight: 'bold' }}>
              {APP._('SUBMISSIONS_PAGE.CHARTS.SUBMISSIONS_BY_ENGAGEMENT')}
            </Text>
            <PieChart
              data={pieData}
              showText
              textColor="black"
              radius={150}
              textSize={20}
              showTextBackground
              textBackgroundRadius={26}
            />
            <LineChart
              data={lineData}
              data2={lineData2}
              height={250}
              showVerticalLines
              spacing={44}
              initialSpacing={0}
              color1="skyblue"
              color2="orange"
              textColor1="green"
              dataPointsHeight={6}
              dataPointsWidth={6}
              dataPointsColor1="blue"
              dataPointsColor2="red"
              textShiftY={-2}
              textShiftX={-5}
              textFontSize={13}
            />
          </View>
          <View>
            <Text
              style={{ textAlign: 'center', fontWeight: 'bold' }}
              variant="bodySmall"
            >
              {APP._('SUBMISSIONS_PAGE.SUBMISSIONS')}
            </Text>
            <DataTable>
              <DataTable.Header>
                {/* <DataTable.Title>Id</DataTable.Title> */}
                <DataTable.Title>
                  {APP._(
                    'SUBMISSIONS_PAGE.SUBMISSION_GRID.ENGAGEMENT_COLUMN_TITLE',
                  )}
                </DataTable.Title>
                <DataTable.Title numeric>
                  {APP._('SUBMISSIONS_PAGE.SUBMISSION_GRID.DATE_COLUMN_TITLE')}
                </DataTable.Title>
              </DataTable.Header>

              {submissions.slice(from, to).map((item) => (
                <DataTable.Row key={item.name}>
                  {/* <DataTable.Cell>{item.name}</DataTable.Cell> */}
                  <DataTable.Cell>{item.engagement_name}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {formatDate(item.entered_on)}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}

              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${items.length}`}
                numberOfItemsPerPageList={numberOfItemsPerPageList}
                numberOfItemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
                showFastPaginationControls
                selectPageDropdownLabel={APP._(
                  'SUBMISSIONS_PAGE.SUBMISSION_GRID.ROWS_PER_PAGE',
                )}
              />
            </DataTable>
          </View>
        </>
      ) : (
        <View>
          <Text style={{ textAlign: 'center' }}>
            {APP._('GLOBAL.LOGIN_REQUIRED')}
          </Text>
        </View>
      )}
    </AppContainer>
  );
};

export default SubmissionsPage;
