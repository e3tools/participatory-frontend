// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useState } from 'react'
// import { AppButton } from "../shared/AppButton";
// import { APP } from "@/app/utils/app";
// import { CameraType, Camera } from 'expo-camera';


// const CameraView = () => {
//     const [camera_type, set_camera_type] = useState(CameraType.back);
//     const [permission, request_permission] = Camera.useCameraPermissions();

//     if(!permission?.granted) {
//         //camera permissions not granted yet
//         return (
//             <View style={styles.container}>
//                 <Text style={{ textAlign: 'center'}}>{APP._('MEDIA.CAMERA_VIEW.NO_CAMERA_PERMISSIONS')}</Text>
//                 <AppButton label={APP._('MEDIA.CAMERA_VIEW.REQUEST_CAMERA_PERMISSION')} on_press={request_permission} />
//             </View>
//         )
//     }
    
//     const toggle_camera_type = () => {
//         set_camera_type(current => (current === CameraType.back ? CameraType.front : CameraType.back));
//     } 

//   return (
//     <View style={styles.container}>
//         <Camera style={styles.camera}>
//             <View style={styles.button_container}>
//                 <TouchableOpacity style={styles.button} onPress={toggle_camera_type}>
//                     <Text style={styles.text}>{APP._('MEDIA.CAMERA.FLIP_CAMERA')}</Text>
//                 </TouchableOpacity>
//             </View>
//         </Camera>
//     </View>
//   )
// }

// export default CameraView

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center'
//     },
//     camera: {
//         flex: 1
//     },
//     button_container: {
//         flex: 1,
//         flexDirection: 'row',
//         backgroundColor: 'transparent',
//         margin: 64
//     },
//     button: {
//         flex: 1,
//         alignSelf: 'flex-end',
//         alignItems: 'center'
//     },
//     text: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white'
//     }
// })