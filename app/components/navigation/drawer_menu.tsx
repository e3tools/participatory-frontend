import { View, Text, Pressable, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Image /*, Button*/ } from 'react-native';
import { List } from 'react-native-paper';
import { DashboardService } from '@/app/services/dashboard';
import { AuthService } from '@/app/modules/auth/services/auth';
import { APP } from '@/app/utils/app';
import { useRouter } from 'expo-router';
import { IDBReadParam } from '@/app/interfaces/database';
import { DocTypeService } from '@/app/services/doctype';
import { EngagementStore } from '@/app/stores/engagement';
import { DOCTYPES } from '@/app/constants/enums';
import { GLOBALS } from '@/app/constants/defaults';
import { useAuth } from '@/app/contexts/auth';

export default function DrawerMenu(props: any) {
  const [dashboards, set_dashboards] = useState([]);
  const [engagements, set_engagements] = useState([]);
  const bottom = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const auth = useAuth();
  const close_drawer = () => {
    navigation.dispatch(DrawerActions.closeDrawer());
  } 
  
  useEffect(() => {  
      const load_engagements = async() => {  
        let cfg = {} as IDBReadParam
        cfg.filters = [['status', '=', 'Open'], ['is_published', '=', 1]]
        cfg.fields = ["*"]// ['name', 'engagement_name', 'engagement_type', 'engagement_template', 'administration_level']
        new DocTypeService('Engagement').get_list(cfg).then((recs) => { 
          set_engagements(recs); 
        })
      } 

      const load_dashboards = async() => {
        DashboardService.get_dashboards().then(recs => {   
          set_dashboards(recs);      
        });
      } 
      if(auth.is_authenticated){
        load_engagements(); 
        load_dashboards();
      }
  }, []);
  
  const navigate_engagement = (props, engagement: object) => {
    EngagementStore.set_current_engagement(engagement);
    if(engagement.has_data_forms){ 
      APP.navigate_to_path(props.navigation, 'views/list/[doctype]', {
        doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
        'engagement': engagement.name,
        'engagement_name': engagement.engagement_name
      });
      // APP.route_to_path('views/list/[doctype]', { 
      //     doctype: `${DOCTYPES.ENGAGEMENT_ENTRY}`,
      //     'engagement': engagement.name
      //   }
      // ) r
    }      
    return {}
  }
  if(!auth.is_authenticated){
    return (
      <View></View>
    )
  }

  return ( 
    <View
        style={{ flex: 1 }}
    >
        <DrawerContentScrollView {...props}>
          <View style={{padding: 20}}>     
          <TouchableOpacity onPress={()=> APP.navigate_to_path(props.navigation, 'screens/home_screen')}>    
            <Image 
              source={require('../../assets/images/logo.png')}
              style={{height: 35}}
              resizeMode='contain'
            /> 
            </TouchableOpacity>
          </View>
          {/* <DrawerItemList {...props} /> */}

          {/* Dashboards */} 
          <List.Accordion
            title={APP._('MAIN_LAYOUT.NAVIGATOR.DASHBOARD')}
            left={props => <List.Icon {...props} icon="view-dashboard" />}>
              {dashboards?.map((item) => ( 
                <List.Item 
                  key={item.name}
                  title={item.name}
                  left={props => <List.Icon {...props} icon='view-dashboard' />}
                  style={ styles.drawer_child }
                  onPress={()=> {
                    APP.navigate_to_path(props.navigation, 'modules/reporting/dashboard/screens/[id]', { id: item.name })
                    // APP.route_to_path('screens/dashboard/[id]', { 
                    //       id: item.name
                    //     }
                    //   )
                    }
                  }
                  onLongPress={()=>{}}
                />
              ))} 
          </List.Accordion>

          {/* Engagements */}
          <List.Accordion
            title={APP._('MAIN_LAYOUT.NAVIGATOR.ENGAGEMENTS')}
            onPress={() => {
              APP.navigate_to_path(props.navigation, 'modules/engage/screens/engage_index_screen', { })
            }}
            onLongPress={() => {}}
            left={props => <List.Icon {...props} icon="account-voice" />}>
              {engagements?.map((engagement) => ( 
                <List.Item 
                  key={engagement.name}
                  title={engagement.engagement_name}
                  left={props => <List.Icon {...props} icon='account-voice' />}
                  style={ styles.drawer_child }
                  onPress={()=>{ navigate_engagement(props, engagement) }}
                  onLongPress={()=>{}}
                />
              ))} 
          </List.Accordion>
          
          {/* Sample form */}
            {/* <List.Item 
            title={APP._('Form View')} 
            left={props => <List.Icon {...props} icon='map-marker-distance' />}
            onPress={()=>{  
              // APP.navigate_to_path(props.navigation, 'views/list/[doctype]', { doctype: 'Engagement Action Task' })
              // APP.route_to_path('views/LockedView', {}, {});
              // APP.route_to_path('views/list/[doctype]', { 
              //     doctype: 'Dummy Form'
              //   }
              // )
              // APP.route_to_path('views/list/[doctype]', { 
              //     doctype: 'Engagement Action Task'
              //   }
              // )
              // APP.route_to_path('views/FormView2', { 
              //     doctype: 'Dummy Form'
              //   }
              // )
              // APP.route_to_path('views/TabForm', {}, {});
            }}
            onLongPress={()=>{}}
          /> */}

          {/* Diagnostics */}
          <List.Item 
            title={APP._('MAIN_LAYOUT.NAVIGATOR.DIAGNOSTICS_TITLE')} 
            left={props => <List.Icon {...props} icon='map-marker-distance' />}
            onPress={()=>{ 
              APP.navigate_to_path(props.navigation, 'modules/mapping/screens/diagnostics_screen', {})
              // APP.route_to_path('screens/diagnostics', {  
              //   }
              // )
            }}
            onLongPress={()=>{}}
          />

          {/* Action Plans
          <List.Accordion
            title={APP._('MAIN_LAYOUT.NAVIGATOR.ACTION_PLANS_TITLE')}
            left={props => <List.Icon {...props} icon="gesture-double-tap" />}>
            <List.Item 
              title={APP._('MAIN_LAYOUT.NAVIGATOR.ACTION_PLANS_ITEMS.VIEW_ACTION_TASK')} 
              left={props => <List.Icon {...props} icon='eye' />}
              style={ styles.drawer_child }
              onPress={()=>{ 
                APP.navigate_to_path(props.navigation, 'views/list/[doctype]', { doctype: 'Engagement Action Task' });
                // APP.route_to_path('views/list/[doctype]', { 
                //     doctype: 'Engagement Action Task'
                //   }
                // )
               }}
              onLongPress={()=>{}}
            /> 
            <List.Item 
              title={APP._('MAIN_LAYOUT.NAVIGATOR.ACTION_PLANS_ITEMS.UPDATE_ACTION_TASK')} 
              left={props => <List.Icon {...props} icon='clock-edit' />}
              style={ styles.drawer_child }
              onPress={()=>{ 
                APP.navigate_to_path(props.navigation, 'views/form/index', { 
                    doctype: 'Engagement Action Task Update',
                    docname: GLOBALS.NEW_RECORD_ID
                });
                // APP.route_to_path('views/form/', { 
                //     doctype: 'Engagement Action Task Update',
                //     docname: GLOBALS.NEW_RECORD_ID
                //   }
                // ) 
              }}
              onLongPress={()=>{}}
            />  
          </List.Accordion> */}

          {/* References & Downloads */}
          <List.Item 
            title={APP._('MAIN_LAYOUT.NAVIGATOR.REFERENCE_RESOURCES_TITLE')} 
            left={props => <List.Icon {...props} icon='book-education' />}
            onPress={()=>{ 
              APP.navigate_to_path(props.navigation, 'modules/resources/screens/index', { });
              //   APP.route_to_path('screens/resources/', {  
              //   }
              // ) 
            }}
            onLongPress={()=>{}}
          />  

          {/* Reports */}
          <List.Accordion
            title={APP._('MAIN_LAYOUT.NAVIGATOR.REPORTS_TITLE')}
            left={props => <List.Icon {...props} icon="chart-bar" />}>
            <List.Item 
              title={APP._('MAIN_LAYOUT.NAVIGATOR.REPORTS_ITEMS.USERS')} 
              left={props => <List.Icon {...props} icon='tablet-dashboard' />}
              style={ styles.drawer_child }
              onPress={()=>{ 
                APP.navigate_to_path(props.navigation, 'views/report/[doctype]', { doctype: 'User' });
                // APP.route_to_path('views/report/[doctype]', { 
                //     doctype: 'User'
                //   }
                // )
              }}
              onLongPress={()=>{}}
            /> 
            <List.Item 
              title={APP._('MAIN_LAYOUT.NAVIGATOR.REPORTS_ITEMS.ENGAGEMENTS')} 
              left={props => <List.Icon {...props} icon='chat' />}
              style={ styles.drawer_child }
              onPress={()=>{ 
                APP.navigate_to_path(props.navigation, 'views/report/[doctype]', { doctype: 'Engagement Entry' });
                // APP.route_to_path('views/report/[doctype]', { 
                //     doctype: 'Engagement Entry'
                //   }
                // )
              }}
              onLongPress={()=>{}}
            />  
          </List.Accordion>
          
          {/* AI Models */}
          <List.Item 
            title={APP._('MAIN_LAYOUT.NAVIGATOR.AI_TOOLS')} 
            left={props => <List.Icon {...props} icon='text-account' />}
            onPress={()=>{  
              APP.navigate_to_path(props.navigation, 'modules/ai/screens/index', { });

                // APP.route_to_path('screens/ai/', {  
                // }
               //)
            }}
            onLongPress={()=>{}}
          />

          {/* Grievances / Feedback */}
          <List.Accordion
            title={APP._('MAIN_LAYOUT.NAVIGATOR.GRM_TITLE')}
            left={props => <List.Icon {...props} icon="volume-high" />}>
            <List.Item 
              title={APP._('MAIN_LAYOUT.NAVIGATOR.GRM_ITEMS.NEW_COMPLAINT')} 
              left={props => <List.Icon {...props} icon='bullhorn-variant' />}
              style={ styles.drawer_child }
              onPress={()=>{ Alert.alert('Coming soon') }}
              onLongPress={()=>{}}
            /> 
            {/* <List.Item 
              title={APP._('MAIN_LAYOUT.NAVIGATOR.REPORTS.ENGAGEMENTS')} 
              left={props => <List.Icon {...props} icon='bullhorn-outline' />}
              style={ styles.drawer_child }
              onPress={()=>{ item_clicked() }}
              onLongPress={()=>{}}
            />   */}
          </List.Accordion>

          {/* User Profile */}
          <List.Item 
            title={APP._('MAIN_LAYOUT.NAVIGATOR.USER_PROFILE')} 
            left={props => <List.Icon {...props} icon='account-lock' />}
            onPress={()=>{ 
              APP.navigate_to_path(props.navigation, 'modules/auth/screens/user_profile_screen', {});
             }}
            onLongPress={()=>{}}
          />

          {/* <List.Section title="Parent 1">
            <List.Accordion
              title="Parent"
              left={props => <List.Icon {...props} icon="folder" />}>
                {dashboards.map((item) => ( 
                  <List.Item 
                    key={item.name}
                    title={item.name}
                    left={props => <List.Icon {...props} icon='folder' />}
                    style={{ marginLeft: 20 }}
                    onPress={()=>{ item_clicked() }}
                    onLongPress={()=>{}}
                  />
                ))}
              <List.Item 
                title="First item"
                left={props => <List.Icon {...props} icon='folder' />}
                style={{ marginLeft: 20 }}
              />
              <List.Item title="Second item" />
            </List.Accordion>
          </List.Section> */}
        </DrawerContentScrollView>  
        <List.Item  
            title={APP._('MAIN_LAYOUT.HEADER.LOGOUT')}
            left={props => <List.Icon {...props} icon='logout' />}
            style={{ paddingBottom: bottom + 10 }}
            onPress={async ()=>{ 
              // const res = await AuthService.logout();
              const res = await auth.logout();
              console.log("Logged out...", res)
              navigation.navigate("modules/auth/screens/login_screen");
            }}
            onLongPress={()=>{}}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  drawer_child: {
    marginLeft: 20, 
  }, 
});