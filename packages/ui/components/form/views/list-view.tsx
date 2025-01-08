import * as React from 'react'; 
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';  
import DocGrid from './base/doc-grid'; 
import AppContainer from '../../shared/app-container';
import { StyleSheet } from 'react-native';
import { APP } from 'common';

const ListView = (props: any) => { 
  const params = useLocalSearchParams();
  const doctype = params.doctype; 
  return (
    <AppContainer>
      <DocGrid
        key={APP.generate_random_string()}
        is_report={false}
        doctype={doctype}
        isChildTable={false}
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