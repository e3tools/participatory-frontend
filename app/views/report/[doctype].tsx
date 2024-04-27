import * as React from 'react'; 
import { DocTypeService } from '@/app/services/doctype';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';  
import { SafeAreaView } from 'react-native-safe-area-context'
import DocGrid from '@/app/views/DocGrid';
import { APP } from '@/app/utils/app';

const ListView = (props: any) => {
  // const { navigation } = props;
  const navigation = useNavigation();  
  const params = useLocalSearchParams();
  const doctype = params.doctype;  
  const db = new DocTypeService(doctype); 

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: `${doctype} ${APP._('REPORT_VIEW_PAGE.TITLE')}` });
  }, []);
  
return (
    <SafeAreaView>  
      <DocGrid
        doctype={doctype}
        is_report={true}
        is_child_table={false}
        on_row_select={(id) => console.log("Row selected")}
        navigation={navigation}
      /> 
    </SafeAreaView>
  ); 
};

export default ListView; 