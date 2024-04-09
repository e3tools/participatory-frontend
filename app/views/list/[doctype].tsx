import * as React from 'react'; 
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';  
import DocGrid from '@/app/views/DocGrid'; 
import AppContainer from '@/app/components/base/AppContainer';
import { StyleSheet } from 'react-native';
import { APP } from '@/app/utils/app';

const ListView = (props: any) => { 
  const navigation = useNavigation();
 
  // console.log("List props: ", props);
  const router = useRouter(); 
  const params = useLocalSearchParams();
  const doctype = params.doctype; 
   
  let title = `${doctype} ${APP._('DOC_LIST_VIEW_PAGE.TITLE')}`;
  if(params['engagement']){
    title = `${params.engagement_name} ${APP._('DOC_LIST_VIEW_PAGE.TITLE')}`;
  } 
  
  React.useEffect(() => {
    navigation.setOptions({ title });
  }, []);

  return (
    <AppContainer> 
      <DocGrid
        is_report={false}
        doctype={doctype}
        is_child_table={false}
        on_row_select={(id) => console.log("Row selected")}
        navigation={props.navigation}
      /> 
    </AppContainer>
  ); 
};

export default ListView;

const styles = StyleSheet.create({
  id_container: {
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: -15,    
  },
})