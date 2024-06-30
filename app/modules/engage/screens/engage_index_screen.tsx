import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, Card, IconButton, List, Paragraph, Badge, Button, Text } from 'react-native-paper'
import { DocTypeService } from '@/app/services/doctype';
import { IDBReadParam } from '@/app/interfaces/database';
import { AppButton } from '@/app/components/shared/AppButton';
import { ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { APP } from '@/app/utils/app';
import { DOCTYPES } from '@/app/constants/enums';
import { AppIconButton } from '@/app/components/shared/AppIconButton';
import { GLOBALS } from '@/app/constants/defaults';
import AppContainer from '@/app/components/shared/AppContainer';

import { theme } from '@/app/core/theme';
import Engagement from '../components/engagement';

// const CAPTION_LEN = 100;

// const EngagementHeaderComponent = ({ engagement }) => {
//   const navigation = useNavigation();

//   const style = StyleSheet.create({
//     parent: {
//       display: 'flex',
//       height: 40, 
//       padding: 5, 
//       backgroundColor: theme.colors.elevation.level3
//     },
//     container: {
//       flex: 1, 
//       flexDirection: 'row', 
//       display: 'flex', 
//       justifyContent: 'space-between'
//     },
//     left_icon: {
//       flexBasis: '10%'
//     },
//     header_text: {
//       flexBasis: '60%', 
//     },
//     card_title: {
//       fontWeight: '700',  
//       textAlign: 'center'
//     },
//     action_buttons: {
//       flexBasis: '20%'
//     },
//     action_container: {
//       display: 'flex',
//       flexWrap: 'nowrap',
//       justifyContent: 'flex-end', 
//       flexDirection: 'row'
//     }
//   })
//   return (
//     <View style={style.parent}>
//       <View style={style.container}>
//         <View style={style.left_icon}>
//           <Avatar.Icon size={30} icon="account-voice" />
//         </View>

//         <View style={style.header_text}>
//           <Text style={style.card_title}>{engagement.engagement_name}</Text>
//         </View>

//         <View style={style.action_buttons}>
//             <View style={style.action_container}>
//               <TouchableOpacity onPress={()=> {
//                   APP.navigate_to_path(navigation, 'views/form/MultiStepForm', {
//                         'engagement': engagement.name,
//                         'entry': GLOBALS.NEW_RECORD_ID
//                       }
//                     );
//                   }}
//                 >
//                 <Avatar.Icon label='New' size={30} icon="plus" on />
//               </TouchableOpacity>

//               <TouchableOpacity onPress={()=> {
//                     Alert.alert("Pending", "More details will be shown here")
//                     }
//                   }
//               >
//                 <Avatar.Icon size={30} icon="dots-vertical" on />
//               </TouchableOpacity> 
//             </View>
//           </View>
//       </View>
      
//       <Card.Title style={{ display: 'none'}}
//       title={engagement.engagement_name}
//       titleStyle={style.card_title}
//       left={(props) => <Avatar.Icon {...props} size={30} icon="account-voice" />}
//       right={(props) => { 
//           return (
//                   // <View style={{ flex: 1 }}>
//                   <View style={styles.top_bottom_actions_container}>
//                   {/* <Badge>
//                     <TouchableOpacity onPress={()=>{ Alert.alert('Showing drafts')}}>
//                       <Text>5</Text>
//                     </TouchableOpacity>
//                   </Badge> */}
//                   <TouchableOpacity onPress={()=> {
//                         APP.navigate_to_path(navigation, 'views/form/MultiStepForm', {
//                             'engagement': engagement.name,
//                             'entry': GLOBALS.NEW_RECORD_ID
//                           }
//                         );
//                       }}
//                   >
//                     <Avatar.Icon  label='New' {...props} size={30} icon="plus" on />
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={()=> {
//                         Alert.alert("Pending", "More details will be shown here")
//                         }
//                       }
//                   >
//                       <Avatar.Icon {...props} size={30} icon="dots-vertical" on />
//                   </TouchableOpacity> 
//                 </View>
//               // </View>
//             )
//         }}
//     />
//     </View>
    
//   )
// }

// const EngagementBodyComponent = ({ engagement }) => {
//   const style = StyleSheet.create({
//     legend_content: {
//       textAlign: 'justify', 
//       // margin: -10
//     },
//   })
//   return (
//     <Card.Content>
//           <Paragraph style={style.legend_content}>
//             {APP.clip_text(engagement.description, CAPTION_LEN) } 
//           </Paragraph>   
//       </Card.Content>
//   )
// }

// const EngagementFooterComponent = ({ engagement }) => {
//   const navigation = useNavigation();
//   const [total_drafts, set_total_drafts] = useState(0);
//   const [total_submissions, set_total_submissions] = useState(0);
//   let cfg = {} as IDBReadParam;
//   const db = new DocTypeService("Engagement Entry");
//   cfg.filters = [['status', '=', 'Submitted'], ['docstatus', '!=', 2], ['engagement', '=', engagement.name]];
//   cfg.fields = ["*"]// ['name', 'engagement_name', 'engagement_type', 'engagement_template', 'administration_level']
  
//   const get_count = async (status: string) => {
//     let cfg = {} as IDBReadParam; 
//     cfg.filters = [['status', '=', status], ['docstatus', '!=', 2], ['engagement', '=', engagement.name]];
//     return await db.get_count(cfg);
//   }
//   const get_total_submissions = async () => {
//     let count = await get_count('Submitted'); 
//     set_total_submissions(count)
//   }

//   const get_total_drafts = async () => {
//     let count = await get_count('Draft'); 
//     set_total_drafts(count)
//   }

//   useEffect(()=> {    
//     get_total_submissions();
//     get_total_drafts();
//   }, [])

//   const style = StyleSheet.create({
//     bottom_actions_container: {
//       flex: 1,
//       flexDirection: 'row',
//       alignContent: 'space-between',
//       alignItems: 'center',
//       justifyContent: 'flex-end',
//       maxHeight: 40
//     },
//     submissions: {
//       fontWeight: '400',
//       color: theme.colors.tertiary,
//       flex: 5,
//       paddingLeft: 10
//     },
//     list_view_button: {
//       flex: 1,
//       width: 500,
//       alignSelf: 'flex-end'
//     },
//   })

//   return (  
//       <View style={style.bottom_actions_container}>
//         <Text style={style.submissions}>{total_submissions} submissions</Text>
//         { total_drafts ?  <Text style={style.submissions}>{total_drafts} drafts</Text> : null } 
//         <AppIconButton style={style.list_view_button} 
//             label={APP._('ENGAGEMENT_LIST_PAGE.BUTTON.EXPLORE')} 
//             icon='page-next-outline' 
//             mode='text'
//             on_press={() => {
//             APP.navigate_to_path(navigation, 'views/list/[doctype]', {
//               doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
//               'engagement': engagement.name,
//               'engagement_name': engagement.engagement_name
//             });
//         }} />
//       </View>  
//   )
// }

// const EngagementComponent = ({ engagement }) => {
//   const navigation = useNavigation();
//   const style = StyleSheet.create({
//     card: { 
//       // margin: 20, 
//       borderRadius: 5,
//       borderColor: theme.colors.error, 
//       // borderWidth: 3,
//       borderBottomWidth: 2
//     },
//   })
//   return (
//     <View 
//         key={engagement.name} 
//         style={style.card} 
//         mode='contained'>
//       <EngagementHeaderComponent engagement={engagement} />      
//       <EngagementBodyComponent engagement={engagement} />
//       {/* <Card.Actions> */}
//         <EngagementFooterComponent engagement={engagement} />
//       {/* </Card.Actions> */}
//     </View>
//   )
// }

const EngagementIndexScreen = () => {
  const [engagements, set_engagements] = useState([]);
  const navigation = useNavigation(); 

  useEffect(() => {  
    const load_engagements = async() => {  
      let cfg = {} as IDBReadParam;
      cfg.filters = [['status', '=', 'Open'], ['is_published', '=', 1]];
      cfg.fields = ["*"]; 
      new DocTypeService('Engagement').get_list(cfg).then((recs) => { 
        set_engagements(recs);
      });
    }     
    load_engagements(); 
  }, []);

  useLayoutEffect(()=> {
    navigation.setOptions({ title: APP._('ENGAGEMENT_LIST_PAGE.TITLE') }); 
  }, [])

  return (
    <AppContainer>
      <ScrollView style={{ display: 'flex' }} key={APP.generate_random_string()}>
        <View style={styles.container}> 
          {
            engagements?.map((engagement) => (  
               <Engagement engagement={engagement} key={engagement.name} /> 
            ))     
          }  
        </View>
      </ScrollView>
    </AppContainer>
  )
}

export default EngagementIndexScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, 
  },
})