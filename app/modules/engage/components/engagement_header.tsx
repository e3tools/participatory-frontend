import { Alert, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar, Card } from 'react-native-paper';
import { APP } from '@/app/utils/app';
import { GLOBALS } from '@/app/constants/defaults';
import { theme } from '@/app/core/theme';

const EngagementHeader = ({ engagement }) => {
    const navigation = useNavigation();
  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        <View style={styles.left_icon}>
          <Avatar.Icon size={30} icon="account-voice" />
        </View>

        <View style={styles.header_text}>
          <Text style={styles.card_title}>{engagement.engagement_name}</Text>
        </View>

        <View style={styles.action_buttons}>
            <View style={styles.action_container}>
              <TouchableOpacity onPress={()=> {
                  APP.navigate_to_path(navigation, 'views/form/MultiStepForm', {
                        'engagement': engagement.name,
                        'entry': GLOBALS.NEW_RECORD_ID
                      }
                    );
                  }}
                >
                <Avatar.Icon label='New' size={30} icon="plus" on />
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> {
                    Alert.alert("Pending", "More details will be shown here")
                    }
                  }
              >
                <Avatar.Icon size={30} icon="dots-vertical" on />
              </TouchableOpacity> 
            </View>
          </View>
      </View>
      
      <Card.Title style={{ display: 'none'}}
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
    </View>   
  )
}

export default EngagementHeader

const styles = StyleSheet.create({
    parent: {
        display: 'flex',
        height: 40, 
        padding: 5, 
        backgroundColor: theme.colors.elevation.level3
      },
      container: {
        flex: 1, 
        flexDirection: 'row', 
        display: 'flex', 
        justifyContent: 'space-between'
      },
      left_icon: {
        flexBasis: '10%'
      },
      header_text: {
        flexBasis: '60%', 
      },
      card_title: {
        fontWeight: '700',  
        textAlign: 'center'
      },
      action_buttons: {
        flexBasis: '20%'
      },
      action_container: {
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'flex-end', 
        flexDirection: 'row'
      }
})