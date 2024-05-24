import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react' 
import * as ImagePicker from 'expo-image-picker';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { APP } from '@/app/utils/app';
import { TextSize } from 'victory-native';
import { Button, Dialog, Icon, IconButton, Portal } from 'react-native-paper';
import { AppButton } from '../shared/AppButton';
import { err } from 'react-native-svg';
import { RecordingOptionsPresets } from 'expo-av/build/Audio';
// import { Camera, CameraType } from 'expo-camera';
import { upload_audio, upload_image } from '@/app/utils/media';
import { UploadFileProps } from '@/app/utils/media';
import { theme } from '@/app/core/theme';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { AppIconButton } from '../shared/AppIconButton';

/**
 * Type to store a select asset of either document, audio, video or photo
 */
export interface MediaAsset {
    mime_type: string,
    file_name: string, 
    size?: number,
    uri: string,
    base64: string
}

// See https://github.com/SCasarotto/casarotto-chat/blob/e0e73b834dc6b8e060b19fb51b2898c79513eb47/src/pages/Main/Main.js#L203
type IMediaHandlerProps = {
    send_image_handler?: (file: UploadFileProps, doctype?: string, docname?: string, fieldname?: string) => void
    send_audio_handler?: (file: UploadFileProps, doctype?: string, docname?: string, fieldname?: string) => void
    visible: boolean,
    on_ok: (asset: MediaAsset) => void,
    on_dismiss: () => void
}

type RecordingState = {
    recording_active: boolean,
    recording: Audio.Recording,
    record_audio_visible: boolean, 
}

/**
 * Transform `source` asset into generic MediaAsset. This is Adapter Pattern
 * @param source 
 */
const adapt_asset = async (source: ImagePicker.ImagePickerAsset | DocumentPicker.DocumentPickerAsset | Audio.Recording) => {
    let dest = {} as MediaAsset;
    dest.file_name = source.fileName || source.name;
    dest.mime_type = source.mimeType;
    dest.size = source.fileSize || source.size;
    dest.uri = source.uri
    dest.base64 = source.base64
    if(!dest.base64 && dest.uri){
        // if base64 string is not provided, read the file
        dest.base64 = await FileSystem.readAsStringAsync(dest.uri, { encoding: FileSystem?.EncodingType?.Base64 });
    } 
    return dest
}

const MediaHandler = (props: IMediaHandlerProps) => {
    const [visible, set_visible] = useState(props.visible);
    const [asset, set_asset] = useState<MediaAsset>(); 
    const [audio_recording, set_audio_recording] = useState<RecordingState>({
        recording_active: false,
        recording: undefined,
        record_audio_visible: false
    })   
    useEffect(()=>{
        set_visible(props.visible);
    }, [props.visible]);
    
    const select_image = async () => {
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
                            adapt_asset(response.assets[0]).then((asst: MediaAsset)=> set_asset(asst));
                        }
                    })
                    .catch((error) => console.log(error))
                }
            }).catch((error) => console.log(error)); 
    }

    const take_photo_video = () => {  
        console.log("Taking photo")   
        ImagePicker.requestCameraPermissionsAsync()
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
                            adapt_asset(response.assets[0]).then((asst: MediaAsset)=> set_asset(asst));
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

    const select_document = async () => {
        DocumentPicker.getDocumentAsync({
            type: "*/*", 
            multiple: false, 
            copyToCacheDirectory: true
        }) 
        .then((response) => {
            if(!response.canceled){  
                adapt_asset(response.assets[0]).then((asst: MediaAsset)=> set_asset(asst));
            }
        })
        .catch((error) => console.log(error))
    }

  return (
    <Portal>
        <Dialog visible={visible} 
                onDismiss={() => {
                    set_visible(false);
                    props.on_dismiss();
                }}  
        >
            <View style={styles.dialog_title_container}>
                    <IconButton icon='close' onPress={()=>{
                            set_visible(false);
                            props.on_dismiss();
                        }
                    }></IconButton>
                    <Text style={styles.dialog_title}>{APP._('MEDIA_HANDLER.DIALOG_TITLE')}</Text> 
                    <Button 
                        mode='text' 
                        // style={{ display: asset ? 'flex' : 'none' }}
                        onPress={() => {
                            if(asset){ 
                                // upload_image(new Array(image));
                                props.on_ok(asset);
                                set_visible(false);
                            }
                            if(audio_recording?.recording) { 
                                props.on_ok(audio_recording?.recording);
                            }
                        }}
                    >
                        {APP._('BUTTON.SAVE')}
                    </Button>
                    <Button 
                        mode='text' 
                        style={{ display: asset ? 'none' : 'none' }}
                        onPress={() => {
                            if(asset){ 
                                upload_image(new Array(asset));
                            }
                            if(audio_recording?.recording) { 
                                upload_audio(audio_recording?.recording);
                            }
                        }}
                    >
                        {APP._('BUTTON.UPLOAD')}
                    </Button>
                </View>   
            <Dialog.Content>
            {/* <View style={styles.container}> */}
                <View style={styles.preview_container}>
                    {
                        asset && asset.mime_type?.includes('image/') && (
                            <View>
                                {/* <Image
                                    source={{
                                        uri: `data:${asset?.mime_type};base64,${asset?.base64}`
                                    }}
                                    style={{ width: 100, height: 100, borderColor: 'green', borderWidth: 1 }}
                                /> */}
                                <Image 
                                    source={{ uri: asset?.uri }}
                                    style={{ width: 200, height: 200, borderColor: theme.colors.error, borderWidth: 1 }}
                                />
                            </View>
                        )
                    }
                    {
                        asset && !asset.mime_type?.includes('image/') && (
                            <Text style={styles.selected_file}>
                                { asset?.file_name }
                            </Text>
                        )
                    } 
                </View>
                <View style={ styles.actions_container }>
                    <Button icon='image' onPress={select_image} mode='contained-tonal' style={styles.button}>
                        <Text>{APP._('MEDIA_HANDLER.SELECT_IMAGE_VIDEO')}</Text>
                    </Button>
                    <Button icon='text-box-search-outline' onPress={select_document} mode='contained-tonal' style={styles.button}>
                        <Text>{APP._('MEDIA_HANDLER.SELECT_DOCUMENT')}</Text>
                    </Button>
                    <Button icon='camera' onPress={take_photo_video} mode='contained-tonal'  style={styles.button}>
                        <Text>{APP._('MEDIA_HANDLER.LAUNCH_CAMERA')}</Text>
                    </Button>
                    <Button icon='microphone' onPress={start_audio_record} mode='contained-tonal' style={[styles.button, {display: 'none'}]}>
                        <Text>{APP._('MEDIA_HANDLER.RECORD_AUDIO')}</Text>
                    </Button> 
                </View>
            {/* </View> */}
            </Dialog.Content>
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
    preview_container: {
        display: 'flex',
        // flex: 1,
        // padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    actions_container: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    button: {
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        width: 200
    },
    dialog_title: {
        fontWeight: 'bold'
    },
    dialog_title_container: {
        display: 'flex', 
        alignItems:'center', 
        flexDirection:'row', 
        justifyContent: 'space-between',
        // backgroundColor: 'green'
    },
    selected_file: { 
        textAlign: 'center',
        margin: 5,
        width: '90%',
        fontWeight: '500',
        fontSize: 12,
        color: theme.colors.secondary
    }
})