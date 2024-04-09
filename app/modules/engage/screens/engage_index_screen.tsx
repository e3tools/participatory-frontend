import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Card, IconButton, List, Paragraph, Badge, Button } from 'react-native-paper'
import { DocTypeService } from '@/app/services/doctype';
import { IDBReadParam } from '@/app/interfaces/database';
import { AppButton } from '@/app/components/shared/AppButton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { APP } from '@/app/utils/app';
import { DOCTYPES } from '@/app/constants/enums';
import { AppIconButton } from '@/app/components/shared/AppIconButton';
import { GLOBALS } from '@/app/constants/defaults';

const CAPTION_LEN = 100;

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
    navigation.setOptions({ title: APP._('ENGAGEMENT_LIST_PAGE.TITLE') }); 
    load_engagements(); 
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}> 
        {engagements?.map((engagement) => ( 
          <Card 
                key={engagement.name} 
                style={styles.card} mode='contained'>            
            <Card.Title 
                title={engagement.engagement_name}
                titleStyle={styles.card_title}
                left={(props) => <Avatar.Icon {...props} size={30} icon="account-voice" />}
                right={(props) => { 
                    return (
                            // <View style={{ flex: 1 }}>
                            <View style={styles.top_bottom_actions_container}>
                            {/* <Badge>
                              <TouchableOpacity onPress={()=>{ Alert.alert('Showing drafts')}}>
                                <Text>5</Text>
                              </TouchableOpacity>
                            </Badge> */}
                            <TouchableOpacity onPress={()=> {
                                  APP.navigate_to_path(navigation, 'views/form/MultiStepForm', {
                                      'engagement': engagement.name,
                                      'entry': GLOBALS.NEW_RECORD_ID
                                    }
                                  );
                                }}
                            >
                              <Avatar.Icon  label='New' {...props} size={30} icon="plus" on />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=> {
                                  Alert.alert("Pending", "More details will be shown here")
                                  }
                                }
                            >
                                <Avatar.Icon {...props} size={30} icon="dots-vertical" on />
                            </TouchableOpacity> 
                          </View>
                        // </View>
                      )
                  }}
                />
            <Card.Content>
                <Paragraph style={styles.legend_content}>
                  {APP.clip_text(engagement.description, CAPTION_LEN) } 
                </Paragraph>   
            </Card.Content>
            <Card.Actions>
              <View style={styles.bottom_actions_container}>
                <Text style={styles.submissions}>{5000} submissions</Text>
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
            </Card.Actions>
          </Card>           
              // <List.Item 
              //   key={engagement.name}
              //   title={engagement.engagement_name}
              //   left={props => <List.Icon {...props} icon='account-voice' />}
              //   style={ styles.drawer_child }
              //   onPress={()=>{ navigate_engagement(props, engagement) }}
              //   onLongPress={()=>{}}
              // />
            
        ))        
      }      
      </View>
    </ScrollView>
  )
}

export default EngagementIndexScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    // margin: 20
  },
  legend_content: {
    textAlign: 'justify', 
    // margin: -10
  },
  card: { 
    margin: 5,
    height: 200
  },
  card_title: {
    fontWeight: '700',  
  },
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
    color: 'gray',
    flex: 5
  },
  list_view_button: {
    flex: 1,
    width: 500,
    alignSelf: 'flex-end'
  },
  top_bottom_actions_container: {
    flex: 1, 
    // height: 60,
    flexDirection: 'row',
    // display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center', 
  },
  add_button: {
    flex: 1,
    flexBasis: 50
  },
  settings_button: {
    flex: 1,
    flexBasis: 50
  }
})