import { Dimensions, StyleSheet, View } from 'react-native'
import React from 'react'
import { Avatar, Button, Card, Text } from 'react-native-paper'
import CardActions from 'react-native-paper/lib/typescript/components/Card/CardActions'
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const cnt = 50;
const Comp = () => {
    return (
        <View>
            {
              [...Array(cnt)].map((e, i) => <Text key={i} style={{ backgroundColor: i%2 == 0 ? 'red': 'blue'}}>{i}</Text>)
            }
        </View>
    )
}


const LockedView = () => {
    const screenHeight = Dimensions.get('window').height - 100
    const LeftContent = () => <Avatar.Icon  icon="folder" />

  return (
    <SafeAreaView>
    {/* <View style={{backgroundColor: 'blue', height: "auto", maxHeight: screenHeight}}> */}
      <Card> 
        <Card.Actions style={{ display: 'flex', justifyContent: 'space-between'}}>
            <Text variant='titleMedium' style={{ flex: 9}}>Title goes here</Text>
            <Button icon='camera' style={{ flex: 1, width: 40}}>Camera</Button>
        </Card.Actions>
        <Card.Content>
            <ScrollView  
                // contentContainerStyle={{ flexGrow: 1 }} 
            >
                <Comp />    
            </ScrollView>
        </Card.Content>
      </Card>
    {/* </View> */}
    </SafeAreaView>
  )
}

export default LockedView

const styles = StyleSheet.create({})