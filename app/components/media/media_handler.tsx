import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react' 
import * as ImagePicker from 'expo-image-picker';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { APP } from '@/app/utils/app';
import { TextSize } from 'victory-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import { AppButton } from '../shared/AppButton';
import { err } from 'react-native-svg';
import { RecordingOptionsPresets } from 'expo-av/build/Audio';
// import { Camera, CameraType } from 'expo-camera';
import { upload_audio, upload_image } from '@/app/utils/media';
import { UploadFileProps } from '@/app/utils/media';
import { theme } from '@/app/core/theme';

// See https://github.com/SCasarotto/casarotto-chat/blob/e0e73b834dc6b8e060b19fb51b2898c79513eb47/src/pages/Main/Main.js#L203
type IFileUpload = {
    send_image_handler?: (file: UploadFileProps, doctype?: string, docname?: string, fieldname?: string) => void
    send_audio_handler?: (file: UploadFileProps, doctype?: string, docname?: string, fieldname?: string) => void
    visible: boolean,
    on_ok: (asset: ImagePicker.ImagePickerAsset | Audio.Recording) => void,
    on_dismiss: () => void
}

type RecordingState = {
    recording_active: boolean,
    recording: Audio.Recording,
    record_audio_visible: boolean, 
}

const MediaHandler = (props: IFileUpload) => {
    // const [resource_path, set_resource_path] = useState({});
    // const [image, set_image] = useState(null);
    const [visible, set_visible] = useState(props.visible);
    const [image, set_image] = useState<ImagePicker.ImagePickerAsset>(); 
    const [audio_recording, set_audio_recording] = useState<RecordingState>({
        recording_active: false,
        recording: undefined,
        record_audio_visible: false
    })

    useEffect(()=>{
        set_visible(props.visible);
    }, [props.visible]);
    
    const select_image = async () => {
        // Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        ImagePicker.requestMediaLibraryPermissionsAsync()
            .then((response) => {
                const { status, expires, permissions } = response; 
                if(status === 'granted'){
                    ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        base64: true,
                        aspect: [4, 3],
                        quality: 1,
                    })
                    .then((response) => {
                        if(!response.canceled){ 
                            set_image(response.assets[0]);
                            // for(const asst in response.assets){
                            //     props.send_image_handler?.(asst);
                            // }
                        }
                    })
                    .catch((error) => console.log(error))
                }
            }).catch((error) => console.log(error)); 

        //     let result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //     allowsEditing: true,
        //     base64: true,
        //     aspect: [4, 3],
        //     quality: 1,
        // }); 

        // if(!result.canceled) {
        //     // set_resouce(result.assets[0]);
        //     set_asset(result.assets[0]);
        //     // console.log(result.assets[0]);
        //     // console.log("base64: ", APP.file_to_base64(result.assets[0].uri))
        // }
        // let options = {
        //     title: APP._('Select Image'),
        //     customButtons: [
        //         {
        //             name: 'customOptionKey',
        //             title: 'Choose file from Custom Option'
        //         },
        //     ],
        //     storageOptions: {
        //         skipBackup: true,
        //         path: 'images',
        //     }
        // };
        // ImagePicker.showImagePicker(options, res => {
        //     console.log("Response = ", res)
        //     if(res.didCancel) {
        //         console.log('User cancelled image picker');
        //     } else if (res.error) {
        //         console.log('ImagePicker error: ', res.error);
        //     } else if (res.customButton) {
        //         console.log('User tapped custom button: ', res.customButton);
        //         alert(res.customButton);
        //     } else {
        //         let source = res;
        //         set_resource_path(source);
        //     }
        // })
    }

    const take_photo_video = () => {  
        console.log("Taking photo")   
        ImagePicker.requestCameraPermissionsAsync()
        // Camera.requestCameraPermissionsAsync()
        // ImagePicker.getCameraPermissionsAsync()
        // Camera.getCameraPermissionsAsync()  
        // Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY)
            .then((response) => {    
                const { status, expires, permissions } = response;
                if(status === 'granted') {
                    ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        base64: true,
                        aspect: [4, 3],
                        quality: 1,
                    })
                    .then((response) => {
                        if(!response.canceled) {
                            set_image(response.assets[0]);
                            // props.send_image_handler?.(response.assets[0]);
                            // for(const asst in response.assets){
                            //     props.send_image_handler?.(asst);
                            // }
                        }
                    })
                    .catch((error) => console.log(error));
                }
            }).catch((error) => console.log(error)); 
    }

    const start_audio_record = () => {        
        Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: false
        })
        .then((response) => {
            return Audio.requestPermissionsAsync();// Camera.requestMicrophonePermissionsAsync(); 
        })
        .then((response) => {
            const { status, expires, permissions } = response;
            if(status === 'granted') {
                const new_recording = new Audio.Recording();
                new_recording
                    .prepareToRecordAsync(RecordingOptionsPresets.HIGH_QUALITY)
                    .then((response) => {
                        return new_recording.startAsync();
                    })
                    .then((response) => {
                        set_audio_recording({
                            recording_active: true,
                            recording: new_recording,
                            record_audio_visible: true
                        })
                    })
                    .catch((error) => console.log(error))
            }
        })
        .catch((error) => {
            console.log(error)
            Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                playThroughEarpieceAndroid: false,
                staysActiveInBackground: false 
            })
        })
    }

    const stop_audio_recording = () => {
        const { recording_active, recording } = audio_recording

        recording
                .stopAndUnloadAsync()
                .then((response) => {
                    set_audio_recording({
                        recording_active: false,
                        recording: undefined,
                        record_audio_visible: false
                    })

                    Audio.setAudioModeAsync({
                        allowsRecordingIOS: false,
                        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                        playsInSilentModeIOS: true,
                        shouldDuckAndroid: true,
                        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                        playThroughEarpieceAndroid: false,
                        staysActiveInBackground: false 
                    })
                })
                .catch((error) => {
                    console.log(error)
                    Audio.setAudioModeAsync({
                        allowsRecordingIOS: false,
                        interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                        playsInSilentModeIOS: true,
                        shouldDuckAndroid: true,
                        interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                        playThroughEarpieceAndroid: false,
                        staysActiveInBackground: false 
                    })
                })
    }

    const select_audio = () => {
        const { recording_active, recording } = audio_recording;
        const { send_audio_handler } = props;

        recording
            .pauseAsync()
            .then((response) => {
                return recording.getURI()
            })
            .then((uri) => {
                return send_audio_handler?.(uri)
            })
            .then(() => {
                stop_audio_recording();
            })
            .catch((error) => {
                console.log(error)
                Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    interruptionModeIOS: InterruptionModeIOS.DuckOthers,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
                    playThroughEarpieceAndroid: false,
                    staysActiveInBackground: false 
                })
            })
    }


  return (
    <Portal>
        <Dialog visible={visible} 
                onDismiss={() => {
                    set_visible(false);
                    props.on_dismiss() 
                }} 
        >
            <View style={styles.container}>
                <View style={styles.container}>
                    <Image
                        source={{
                            // uri: 'data:image/png;base64,' + image?.base64,
                            uri: `data:${image?.mimeType};base64,${image?.base64}`
                            // uri: image?.uri
                        }}
                        style={{ width: 100, height: 100, borderColor: 'green', borderWidth: 1 }}
                    />
                    <Image 
                        source={{ uri: image?.uri }}
                        style={{ width: 200, height: 200, borderColor: 'red', borderWidth: 1 }}
                    />
                    {/* <Text style={{ alignItems: 'center' }}>
                        { image?.uri }
                    </Text> */}
                    <View style={{ display: 'flex' }}>
                        <Button onPress={select_image} mode='contained-tonal' style={styles.button}>
                            <Text>{APP._('MEDIA_HANDLER.SELECT_FILE')}</Text>
                        </Button>
                        <Button onPress={take_photo_video} mode='contained-tonal'  style={styles.button}>
                            <Text>{APP._('MEDIA_HANDLER.LAUNCH_CAMERA')}</Text>
                        </Button>
                        <Button onPress={start_audio_record} mode='contained-tonal' style={styles.button}>
                            <Text>{APP._('MEDIA_HANDLER.RECORD_AUDIO')}</Text>
                        </Button>
                    </View>
                    <View style={{ display: image ? 'flex' : 'none'}}>
                        <AppButton label={APP._('BUTTON.SAVE')} on_press={() => {
                            if(image){ 
                                upload_image(new Array(image));
                                props.on_ok(image);
                            }
                            if(audio_recording?.recording) { 
                                props.on_ok(audio_recording?.recording);
                            }
                        }} />
                        <AppButton label={APP._('BUTTON.UPLOAD')} on_press={() => {
                            if(image){ 
                                upload_image(new Array(image));
                            }
                            if(audio_recording?.recording) { 
                                upload_audio(audio_recording?.recording);
                            }
                        }} />
                    </View> 
                </View>
            </View>
        </Dialog>
    </Portal>
  )
}

export default MediaHandler

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        // flex: 1,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    button: {
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200
    } 
})