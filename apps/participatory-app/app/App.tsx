import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
// import { useIsFocused } from '@react-navigation/native'
// import Timeline from 'react-native-timeline-flatlist'
 

const App = () => {
  return (
    <View>
      <Text>Entry point to the App</Text>
    </View>
  )
}

export default App

// const styles = StyleSheet.create({})

// const AppTimeline = () => {
//     const is_focused = useIsFocused();
//     const [selected, set_selected] = useState(); 
//     const data = [
//         {
//             time: '01:00',
//             image_url: null,
//             title: 'Inform',
//             side: 'left',
//             description: 'Handout fact sheets or call meetings clearly described as informational',
//             color: 'red',
//             icon: 'thumb_up'
//           },
//           {
//             time: '02:00',
//             image_url: null,
//             title: 'Consult',
//             side: 'left',
//             description: 'Give the public chances to comment, convene focus groups design public meetings that aim for dialogue',
//             color: 'orange',
//             icon: 'record_voice_over'
//           }, 
//           {
//             time: '03:00',
//             image_url: null,
//             title: 'Involve',
//             side: 'left',
//             description: 'Conduct workshops; place interested or affected members on decision-making boards or groups',
//             color: 'blue',
//             icon: 'settings'
//           }, 
//           {
//             time: '04:00',
//             image_url: null,
//             title: 'Collaborate',
//             side: 'left',
//             description: 'Create committees with members who have decision making authority',
//             color: 'blue',
//             icon: 'thumb_up'
//           }, 
//           {
//             time: '05:00',
//             image_url: null,
//             title: 'Empower',
//             side: 'left',
//             description: 'Create citizen juries; hand over decision making to commissions',
//             color: 'blue',
//             icon: 'done_all'
//           },
//       ]
    
//   return (
//     <Timeline 
//         style={styles.list}
//         data={data}
//         circleSize={20}
//         circleColor='rgba(0,0,0,0)'
//         lineColor='rgb(45,156,219)'
//         timeContainerStyle={{minWidth:52, marginTop: -5}}
//         timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
//         descriptionStyle={{color:'gray'}}
//         options={{
//             style:{paddingTop:5}
//         }}
//         innerCircle={'icon'}
//         onEventPress={(data) => { 
//             set_selected(data);
//         }}
//         renderDetail={(row_data, section_id, row_id) => {
//             let title = <Text style={[styles.title]}>{row_data.title}</Text>
//             var desc = null
//             if(row_data.description && row_data.image_url)
//                 desc = (
//                     <View style={styles.descriptionContainer}>   
//                         <Image source={{uri: row_data.imageUrl}} style={styles.image}/>
//                         <Text style={[styles.textDescription]}>{row_data.description}</Text>
//                     </View>
//                 )
            
//             return (
//                 <View style={{flex:1}}>
//                     {title}
//                     {desc}
//                 </View>
//             )
//         }}
//     />
//   )
// }

// // export default AppTimeline

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         paddingTop:65,
//         backgroundColor:'white'
//       },
//     list: {
//         flex: 1,
//         marginTop:20,
//     },
//     title:{
//         fontSize:16,
//         fontWeight: 'bold'
//     },
//     descriptionContainer:{
//         flexDirection: 'row',
//         paddingRight: 50
//     },
//     image:{
//         width: 50,
//         height: 50,
//         borderRadius: 25
//     },
//     textDescription: {
//         marginLeft: 10,
//         color: 'gray'
//     }
// })